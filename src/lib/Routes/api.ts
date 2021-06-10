import { Request, Response, Router, NextFunction } from 'express'
import Detector from '../Detector'


export default class APIRouer {

    private keys: string[] = JSON.parse(process.env.KEYS || '[]')

    router = Router()

    constructor(public detector: Detector) {
        this.router.use(this.authorization)

        this.router.get('/detect', async (req, res) => {
            if (!req.query.image) return void res.status(403).json({ 
                error: 'Image not provided'
            })
            const detect = await this.detector.detect(req.query.image as string)
            if (detect.error && !detect.result) return void res.status(500).json({
                error: detect.error
            })
            return void res.json({ result: detect.result })
        })
    }

    authorization = (req: Request, res: Response, next: NextFunction): void => {
        if (typeof req.headers.authorization !== 'string' || this.keys.includes(req.headers.authorization)) {
            return void res.status(401).json({ 
                status: res.status,
                error: (req.headers.authorization) ? 'No Auth Key Found' : 'Invalid Auth Key'
            })
        }
        next()
    }
}