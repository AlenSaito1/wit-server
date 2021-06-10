import { Router, json } from 'express'
import Detector from '../Detector'
export default class APIRouer {
    private keys: string[] = process.env.KEYS ? process.env.KEYS.split(',') : []

    router = Router()

    constructor(public detector: Detector) {
        this.router.use(json({ limit: 5000000 }))

        this.router.get('/detect', async (req, res) => {
            if (!req.query.image)
                return void res.status(403).json({
                    error: 'Image not provided'
                })
            const detect = await this.detector.detect(req.query.image as string)
            if (detect.error && !detect.result)
                return void res.status(500).json({
                    error: detect.error
                })
            return void res.json({ result: detect.result })
        })

        this.router.post('/detect', async (req, res) => {
            if (!req.body.image)
                return void res.status(403).json({
                    error: 'Image not provided'
                })
            console.log(req.body)
            const detect = await this.detector.detect(req.body.image as string)
            if (detect.error && !detect.result)
                return void res.status(500).json({
                    error: detect.error
                })
            return void res.json({ result: detect.result })
        })
    }
}
