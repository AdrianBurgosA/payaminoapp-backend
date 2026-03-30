import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req
    const start = Date.now()

    res.on('finish', () => {
      const { statusCode } = res
      const ms = Date.now() - start

      const message = `${method} ${originalUrl} ${statusCode} - ${ms}ms`

      if (statusCode >= 500) {
        this.logger.error(message, { context: 'HTTP' })
      } else if (statusCode >= 400) {
        this.logger.warn(message, { context: 'HTTP' })
      } else {
        this.logger.log('info', message, { context: 'HTTP' })
      }
    })

    next()
  }
}