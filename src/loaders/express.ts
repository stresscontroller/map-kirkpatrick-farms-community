import express, { Application, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser'
import Logging from '../config/logging'
import cors from 'cors'
import adminRoutes from '../routes/admin.routes'
import authRoutes from '../routes/auth.routes'
import userRoutes from '../routes/user.routes'
import { NODE_ENV } from '../config/config';

export default async function setup(app: Application): Promise<Application> {
    if (NODE_ENV === 'production') {
        app.use(cors({ origin: 'url' }));
        app.options('*', cors({ origin: 'url' }));
      } else {
        app.use(cors());
        app.options('*', cors());
      }
    app.use(express.json())
    app.use('/api/auth/admin', adminRoutes)
    app.use('/api/auth', authRoutes)
    app.use('/api/users', userRoutes)

    app.get('/', (req, res) =>{
        res.send('Hello world')
    })
    app.use((req: Request, res: Response, next: NextFunction) => {
        Logging.info(
        `incomming -> method: [${req.method}] - url: [${req.url}] - ip: [${req.socket.remoteAddress}]`,
        )

        res.on('finish', () => {
        Logging.info(
            `incomming -> method: [${req.method}] - url: [${req.url}] - ip: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`,
        )
        })

        next()
    })

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cookieParser())

  app.use((req: Request, res: Response, next: NextFunction) => {
    // Allow requests from all origins
    //Will be configured for App specific domain later.
    res.header('Access-Control-Allow-Origin', '*')

    // Allow specific HTTP methods
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

    // Allow specific custom headers (if needed)
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Allow credentials (if your app uses credentials)
    res.header('Access-Control-Allow-Credentials', 'true')

    // Handle preflight requests by responding with 200 status
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    // Pass control to the next middleware
    next()
  })
    return app;

}