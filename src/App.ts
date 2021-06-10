import { EventEmitter } from 'events'
import Detector from './lib/Detector'
import Server from './lib/Server'

export default class App extends EventEmitter {
    constructor() {
        super()
    }

    detector = new Detector()
    
    server = new Server(this.detector, Number(process.env.PORT))
    start = async (): Promise<void> => {
        this.detector.on('ready', async () => this.emit('detector-ready', true))
        this.server.on('ready', (PORT: number) => this.emit('server-ready', PORT))
        this.detector.load()
        this.server.load()
    }
}