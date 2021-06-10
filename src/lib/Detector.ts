import { EventEmitter } from 'events'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { node } from '@tensorflow/tfjs-node'
import { getBufferFromUrl } from './Request'

export default class extends EventEmitter {
    model!: cocoSsd.ObjectDetection
    constructor() {
        super()
    }

    private detectRaw = async (image: Buffer) => {
        const decodedImage = node.decodeImage(new Uint8Array(image), 3)
        return await this.model.detect(decodedImage)
    }

    detect = async (image: string | Buffer): Promise<{ result?: cocoSsd.DetectedObject[]; error?: string }> => {
        try {
            if (typeof image === 'string') {
                if (image.startsWith('data')) {
                    image = this.dataURIToBuffer(image)
                } else image = await getBufferFromUrl(image)
            }
            return { result: await this.detectRaw(image) }
        } catch (err) {
            console.log(err)
            return { error: (err as Error).message || 'Error' }
        }
    }

    load = async (): Promise<void> => {
        this.model = await cocoSsd.load()
        this.emit('ready')
    }

    dataURIToBuffer = (uri: string): Buffer => {
        uri = uri.replace(/\r?\n/g, '')

        const firstComma = uri.indexOf(',')
        if (firstComma === -1 || firstComma <= 4) {
            throw new TypeError('malformed data: URI')
        }

        const meta = uri.substring(5, firstComma).split(';')

        let charset = ''
        let base64 = false
        const type = meta[0] || 'text/plain'
        let typeFull = type
        for (let i = 1; i < meta.length; i++) {
            if (meta[i] === 'base64') {
                base64 = true
            } else {
                typeFull += `;${meta[i]}`
                if (meta[i].indexOf('charset=') === 0) {
                    charset = meta[i].substring(8)
                }
            }
        }
        if (!meta[0] && !charset.length) {
            typeFull += ';charset=US-ASCII'
            charset = 'US-ASCII'
        }
        const encoding = base64 ? 'base64' : 'ascii'
        const data = unescape(uri.substring(firstComma + 1))
        const buffer = Buffer.from(data, encoding) as MimeBuffer

        buffer.type = type
        buffer.typeFull = typeFull

        buffer.charset = charset

        return buffer
    }
}
interface MimeBuffer extends Buffer {
    type: string
    typeFull: string
    charset: string
}
