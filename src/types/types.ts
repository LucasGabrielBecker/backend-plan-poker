import { Request, Response } from 'express'
import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export type SocketType = Socket<DefaultEventsMap, any>
export type ExpressRequest = {
	req: Request
	res: Response
}

export type Room = {
	id?: string
	name: string
}

export type UsersVoted = {
	id: string
	cardId: string
	points: number
}
export type User = {
	id: string
	username: string
	socketId: string
	points?: any
}
