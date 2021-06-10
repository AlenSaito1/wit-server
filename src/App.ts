import { config } from 'dotenv'
config()
import chalk from 'chalk'
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
        this.detector.on('ready', async () => {
            this.emit('detector-ready', true)
            this.server.on('ready', (PORT: number) => {
                this.emit('server-ready', PORT)
                this.emit('ready')
            })
            this.server.load()
        })
        this.detector.load()
        this.server.load()
    }

    log = (body: string, header = '[APP]', error?: boolean): void => {
        console.log(
            chalk[(!error ? 'green' : 'red')](header),
            chalk.blueBright(Date.now().toString()),
            chalk.yellowBright(body)
        )
    }
}