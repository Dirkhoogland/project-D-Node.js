import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const requests: Record<string, { count: number; lastRequest: number }> = {};

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
        const now = Date.now();
        const windowMs = 60 * 1000; // 60 seconden
        const maxRequests = 60; // Maximaal 60 requests per minuut

        if (!requests[ip]) {
            requests[ip] = { count: 1, lastRequest: now };
        } else {
            if (now - requests[ip].lastRequest < windowMs) {
                requests[ip].count++;
                if (requests[ip].count > maxRequests) {
                    throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
                }
            } else {
                requests[ip] = { count: 1, lastRequest: now };
            }
        }
        next();
    }
}
