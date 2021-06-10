import { EventEmitter } from 'events'
import Detector from './lib/Detector'

export default class App extends EventEmitter {
    constructor() {
        super()
    }

    start = async (): Promise<void> => {
        const detector = new Detector()
        detector.on('ready', async () => this.emit('detector-ready', true))
        detector.load()
    }
}