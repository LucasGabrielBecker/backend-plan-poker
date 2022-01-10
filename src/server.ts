import { Server } from 'socket.io'
import express, { Request, Response } from 'express'
import { createServer } from 'http'
import { CronJob } from 'cron'
const app = express()
const PORT = process.env.PORT || 5000
import cors from 'cors'
import EVENTS from './eventsEnum'
import { v4 } from 'uuid'
import mongoose from 'mongoose'
import { Card, Room } from './Schemas'
import {
	getCards,
	register,
	getConnectedClients,
	setVotingCard,
	notifyUserDisconnect,
	handleVote,
	parseConnectedClients
} from './handlers'
import { SocketType } from './types'

const server = createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*'
	}
})

let disconnectedList = []
const RUN_EACH_10_SECONDS = '*/10 * * * * *'

// new CronJob(
// 	RUN_EACH_10_SECONDS,
// 	function () {
// 		if (!disconnectedList.length) return
// 		console.log(disconnectedList)
// 		const users = parseConnectedClients()

// 		for (const id of disconnectedList) {
// 			const user = users.find(u => u.socketId === id)
// 			if (!user) return
// 			io.emit(EVENTS.USER_DISCONNECTED, user)
// 		}

// 		console.log('notifyusers disconnected rodou')
// 	},
// 	null,
// 	true,
// 	'America/Los_Angeles'
// ).start()

app.use(cors())
app.use(express.json())
app.get('/', async (res: Response): Promise<Response> => {
	return res.status(200).send({ status: 'ok' })
})

app.post('/rooms/create', async (req: Request, res: Response) => {
	const { cards } = req.body

	try {
		let newCards = null
		if (cards) {
			newCards = await Card.create(cards)
		}

		const cardsIds = newCards?.map(card => card._id || '')

		const roomId = v4()
		const newRoom = await Room.create({ name: roomId, cards: cardsIds ?? [] })
		await newRoom.populate('cards')

		return res
			.status(201)
			.send({ ok: true, msg: 'Sala criada com sucesso!', room: newRoom })
	} catch (error) {
		const err = error.message || error
		console.error(err)
		return res.status(409).send({ ok: false, msg: err })
	}
})

app.get('/rooms', async (req, res) => {
	try {
		const rooms = await Room.find({})

		return res.status(200).send({ ok: true, rooms })
	} catch (error) {
		return res.status(404).send({ ok: false, msg: error.message || error })
	}
})

app.get('/check_room/:roomid', async (req, res) => {
	const roomId = req.params.roomid
	const room = await Room.findOne({ name: roomId })

	if (!room) {
		return res.status(404).send({
			ok: false,
			msg: 'Esta sala não existe, verifique o código inserido.'
		})
	}
	return res.status(200).send({ ok: true, msg: 'Sala existe' })
})

app.get('/rooms/:roomid', async (req, res) => {
	const roomid = req.params.roomid
	const room = await Room.findOne({ name: roomid })
		.populate('cards', ['title', 'description', 'createdAt'])
		.select('-__v')
	const connectedClients = getConnectedClients()

	if (!room) {
		return res.status(404).send({
			ok: false,
			msg: 'Sala nao encontrada'
		})
	}
	return res.status(200).send({ ok: true, room, connectedClients })
})

io.on('connection', (socket: SocketType) => {
	socket.on(EVENTS.GET_CARDS, payload => {
		getCards(io)
	})

	socket.on(EVENTS.REGISTER, payload => {
		register(io, { ...payload, socketId: socket.id })
	})

	socket.on(EVENTS.GET_CONNECTED_CLIENTS, () => {
		const clients = getConnectedClients()
	})

	socket.on(EVENTS.SET_VOTING_CARD, async payload => {
		console.log(payload)
		setVotingCard(io, payload)
	})

	socket.on(EVENTS.VOTE, payload => {
		handleVote(io, payload)
	})

	socket.on(EVENTS.SHOW_VOTES, () => {
		io.emit(EVENTS.NOTIFY_SHOW_VOTES)
	})

	socket.on('disconnect', () => {
		const disconnectedUser = notifyUserDisconnect(socket.id)
		if (disconnectedUser) disconnectedList.push(disconnectedUser.id)
	})
})

server.listen(PORT, async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.78anz.mongodb.net/plan-poker?retryWrites=true&w=majority`
		)
		console.log('DB Connected')
		console.log('Server hosted on port: ', PORT)
	} catch (e) {
		console.log(e)
		process.exit(1)
	}
})
