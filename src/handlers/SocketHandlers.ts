import EVENTS from '../eventsEnum'
import { v4 } from 'uuid'
import { Room } from '../Schemas'
import { UsersVoted, User } from '../types/types'
const connectedClients = new Map<string, User>()
let cards = [
	{
		id: v4(),
		title: 'Primeiro Card',
		description: 'Some description would go here',
		voting: false,
		votes: []
	},
	{
		id: v4(),
		title: 'Segundo Card',
		description: 'Some description would go here',
		voting: true,
		votes: []
	}
]

let voted: UsersVoted[] = []

export const getCards = socket => {
	socket.emit(EVENTS.UPDATE_CARDS, {
		cards,
		connectedClients: parseConnectedClients()
	})
}

export const register = (socket, payload) => {
	connectedClients.set(payload.id, payload)
	socket.emit(EVENTS.NEW_CLIENT, {
		newUser: payload.username,
		connectedClients: parseConnectedClients()
	})
}

export const getConnectedClients = () => {
	return parseConnectedClients()
	// socket.emit(EVENTS.CONNECTED_CLIENTS, parseConnectedClients());
}

export const setVotingCard = async (socket, payload) => {
	const { cardId, room } = payload
	const dbRoom = await Room.findOne({ name: room }).populate('cards')

	socket.emit(
		EVENTS.NEW_VOTING_CARD,
		dbRoom.cards.find(card => card._id.toString() === cardId)
	)
}

export const notifyUserDisconnect = (socketId): User => {
	if (!socketId) return
	const users = parseConnectedClients()
	const disconnectedUser = users.find(u => u.socketId === socketId)
	if (!disconnectedUser) return
	connectedClients.delete(disconnectedUser.id)
	return disconnectedUser
}

export const handleVote = async (socket, payload) => {
	console.log(payload)
	const { userId, points, cardId } = payload
	voted.push({ id: userId, cardId, points })
	const user = connectedClients.get(userId)
	connectedClients.set(userId, { ...user, points })

	socket.emit(EVENTS.UPDATE_USERS, {
		users: parseConnectedClients(),
		usersAlreadyVoted: voted.map(u => u.id)
	})
}

export const parseConnectedClients = () =>
	Array.from(connectedClients, ([item, value]) => ({ ...value }))
