import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from '../../src/logging/logging.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserLogEntity } from '../../src/logging/entities/userlog.entity';
import { Repository } from 'typeorm';

describe('LoggingService', () => {
    let service: LoggingService;
    let repo: jest.Mocked<Repository<UserLogEntity>>;
    let mockQB: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoggingService,
                {
                    provide: getRepositoryToken(UserLogEntity),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        createQueryBuilder: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<LoggingService>(LoggingService);
        repo = module.get(getRepositoryToken(UserLogEntity));

        mockQB = {
            andWhere: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
        };

        repo.createQueryBuilder.mockReturnValue(mockQB);
    });

    // logUser
    describe('logUser', () => {
        it('logs when username is provided', async () => {
            const mockLog = {} as UserLogEntity;
            repo.create.mockReturnValue(mockLog);
            repo.save.mockResolvedValue(mockLog);

            await service.logUser('john', 'db', 'q', '/url', true, 'GET', '1.1.1.1', undefined, 200);

            expect(repo.save).toHaveBeenCalledWith(mockLog);
        });

        it('does not log when username is missing', async () => {
            await service.logUser(undefined as any, 'db', 'q', '/url', true, 'GET', '1.1.1.1', '', 200);

            expect(repo.save).not.toHaveBeenCalled();
        });

        it('includes errorMessage when provided', async () => {
            const mockLog = {} as UserLogEntity;
            repo.create.mockReturnValue(mockLog);
            repo.save.mockResolvedValue(mockLog);

            await service.logUser('x', 'db', '', '', false, 'POST', '::1', 'Oops', 500);

            expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ errorMessage: 'Oops' }));
        });

        it('includes unusual values (PATCH, IPv6, 418)', async () => {
            const mockLog = {} as UserLogEntity;
            repo.create.mockReturnValue(mockLog);
            repo.save.mockResolvedValue(mockLog);

            await service.logUser('dev', 'db', '', '', false, 'PATCH', '::1', undefined, 418);

            expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
                httpMethod: 'PATCH',
                clientIP: '::1',
                responseCode: 418,
            }));
        });
    });

    // findLogs
    describe('findLogs', () => {
        it('returns all logs without filters', async () => {
            await service.findLogs({});
            expect(mockQB.getMany).toHaveBeenCalled();
        });

        it('applies username filter', async () => {
            await service.findLogs({ username: 'john' });
            expect(mockQB.andWhere).toHaveBeenCalledWith('log.username = :username', { username: 'john' });
        });

        it('applies database filter', async () => {
            await service.findLogs({ database: 'rtha' });
            expect(mockQB.andWhere).toHaveBeenCalledWith('log.database = :database', { database: 'rtha' });
        });

        it('applies httpMethod filter', async () => {
            await service.findLogs({ httpMethod: 'GET' });
            expect(mockQB.andWhere).toHaveBeenCalledWith('log.httpMethod = :httpMethod', { httpMethod: 'GET' });
        });

        it('applies responseCode filter', async () => {
            await service.findLogs({ responseCode: 404 });
            expect(mockQB.andWhere).toHaveBeenCalledWith('log.responseCode = :responseCode', { responseCode: 404 });
        });

        it('applies startDate filter', async () => {
            await service.findLogs({ startDate: '2024-06-01' });
            expect(mockQB.andWhere).toHaveBeenCalledWith('log.loggedAt >= :startDate', { startDate: '2024-06-01' });
        });

        it('applies endDate filter', async () => {
            await service.findLogs({ endDate: '2024-06-30' });
            expect(mockQB.andWhere).toHaveBeenCalledWith('log.loggedAt <= :endDate', { endDate: '2024-06-30' });
        });
    });
});
