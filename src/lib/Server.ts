import EventEmitter from 'events'
import express from 'express'
import Detector from './Detector'
import APIRouer from './Routes/api'

export default class Server extends EventEmitter {

    app = express()

    API: APIRouer

    constructor(detector: Detector, private PORT = 4000) {
        super()
        this.API = new APIRouer(detector)
    }

    load = async (): Promise<void> => {
        this.app.listen(this.PORT, () => this.emit('ready', this.PORT))
    }
}