import EventEmitter from 'events'
import express from 'express'
import Detector from './Detector'
import APIRouer from './Routes/API'
import cors from 'cors'

export default class Server extends EventEmitter {
    app = express()

    API: APIRouer

    constructor(detector: Detector, private PORT: number) {
        super()
        this.API = new APIRouer(detector)
        this.app.use(cors({
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
            ],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: '*',
            preflightContinue: false,
        }))
        this.app.use('/api', this.API.router)
    }

    load = async (): Promise<void> => {
        if (!this.PORT) this.PORT = 4000
        this.app.listen(this.PORT, () => this.emit('ready', this.PORT))
    }
}
