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

    detect = async (image: string | Buffer): Promise<{ result?: cocoSsd.DetectedObject[], error?: string }> => {
        try {
            if (typeof image === 'string') image = await getBufferFromUrl(image)
            return { result:  await this.detectRaw(image) }
        } catch(err) {
            return { error: (err as Error).message || 'Error' }
        }
    }

    load = async (): Promise<void> => {
        this.model = await cocoSsd.load()
        this.emit('ready')
    }


}