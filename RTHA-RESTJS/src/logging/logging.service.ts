import { UserLogEntity } from "./entities/userlog.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserLogDto } from "./dto/logging-query.dto";


@Injectable()
export class LoggingService {
    constructor(
        @InjectRepository(UserLogEntity)
        private readonly userLogRepository: Repository<UserLogEntity>,
    ) { }

    async logUser(username: string, database: string, query: string, requestUrl: string, resultFound = false, httpMethod: string, clientIP: string, errorMessage: string | undefined, responseCode: number): Promise<void> {
        console.log('LoggingService.logUser called');
        if (username === null || username === undefined) {
            console.log('Username can not be null or undefined.');
            return;
        }
        const logEntry = this.userLogRepository.create({
            username,
            database,
            query,
            requestUrl,
            resultFound,
            httpMethod,
            clientIP,
            errorMessage,
            responseCode,
        });
        await this.userLogRepository.save(logEntry);
        console.log(`Logged user: ${username} on database: ${database}`);
    }

    // Thsi enables searching with not all queries filled in 
    async findLogs(query: UserLogDto): Promise<UserLogEntity[]> {
        const qb = this.userLogRepository.createQueryBuilder('log');

        if (query.username) {
            qb.andWhere('log.username = :username', { username: query.username });
        }
        if (query.database) {
            qb.andWhere('log.database = :database', { database: query.database });
        }
        if (query.httpMethod) {
            qb.andWhere('log.httpMethod = :httpMethod', { httpMethod: query.httpMethod });
        }
        if (query.responseCode !== undefined) {
            qb.andWhere('log.responseCode = :responseCode', { responseCode: query.responseCode });
        }
        if (query.startDate) {
            qb.andWhere('log.loggedAt >= :startDate', { startDate: query.startDate });
        }
        if (query.endDate) {
            qb.andWhere('log.loggedAt <= :endDate', { endDate: query.endDate });
        }

        return await qb.getMany();
    }
}
