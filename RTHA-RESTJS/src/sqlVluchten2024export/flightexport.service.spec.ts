import { Test, TestingModule } from '@nestjs/testing';
import { FlightExportService } from './flightexport.service';
import { FlightExportEntity } from './entities/flightexport.entity';
import { ExportLogEntity } from './entities/exportlog.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('FlightExportService', () => {
    let service: FlightExportService;
    let repo: jest.Mocked<Repository<FlightExportEntity>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FlightExportService,
                {
                    provide: getRepositoryToken(FlightExportEntity),
                    useValue: {
                        createQueryBuilder: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(ExportLogEntity),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<FlightExportService>(FlightExportService);
        repo = module.get(getRepositoryToken(FlightExportEntity));
    });

    describe('findOneById', () => {
        it.each([
            [123, { FlightID: 123 }],
            [456, { FlightID: 456 }],
        ])('should return flight for FlightID %i', async (id, expected) => {
            repo.findOne.mockResolvedValue(expected as FlightExportEntity);

            const result = await service.findOneById(id);

            expect(repo.findOne).toHaveBeenCalledWith({ where: { FlightID: id } });
            expect(result).toEqual(expected);
        });

        it.each([
            [9999999999, null],
            [0, null],
            [-1, null],
        ])('should throw error if FlightID %i not found', async (id, _) => {
            repo.findOne.mockResolvedValue(null);

            await expect(service.findOneById(id)).rejects.toThrow('Flight not found');
        });
    });


    describe('findWithFilters', () => {
        it('should build query with filters and return data', async () => {
            const mockQueryBuilder: any = {
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[{ FlightID: 1, Diverted: false }], 1]),
            };

            repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const filters = { Diverted: false };
            const result = await service.findWithFilters(filters, 10, 0);

            expect(repo.createQueryBuilder).toHaveBeenCalledWith('f');
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('f.Diverted = :Diverted', { Diverted: false });
            expect(result).toEqual({ data: [{ FlightID: 1, Diverted: false }], total: 1 });
        });

        it('should build query with filter Country = "Spain" and return data', async () => {
            const mockQueryBuilder: any = {
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([
                    [{ FlightID: 2, Country: 'Spain' }],
                    1,
                ]),
            };

            repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const filters = { Country: 'Spain' };
            const result = await service.findWithFilters(filters, 10, 0);

            expect(repo.createQueryBuilder).toHaveBeenCalledWith('f');
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('f.Country = :Country', { Country: 'Spain' });
            expect(result).toEqual({
                data: [{ FlightID: 2, Country: 'Spain' }],
                total: 1,
            });
        });

        it('should skip undefined/null/empty string filters', async () => {
            const mockQueryBuilder: any = {
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            };

            repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const filters = {
                Type: undefined,
                FlightNumber: '',
                Diverted: null,
            } as any;

            await service.findWithFilters(filters, 10, 0);

            expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
        });

        it.each([
            [
                {
                    Diverted: false,
                    FlightNumber: 'TRA6061',
                    Gate: 3,
                    ScheduledUTC: new Date('2024-01-01T04:55:00Z'),
                },
                {
                    FlightID: 123,
                    Diverted: false,
                    FlightNumber: 'TRA6061',
                    Gate: 3,
                    ScheduledUTC: new Date('2024-01-01T04:55:00Z'),
                },
            ],
            [
                {
                    Diverted: true,
                    FlightNumber: 'KL123',
                    Gate: 5,
                    ScheduledUTC: new Date('2025-12-25T10:30:00Z'),
                },
                {
                    FlightID: 456,
                    Diverted: true,
                    FlightNumber: 'KL123',
                    Gate: 5,
                    ScheduledUTC: new Date('2025-12-25T10:30:00Z'),
                },
            ],
            [
                {
                    Diverted: false,
                    FlightNumber: 'HV987',
                    Gate: 8,
                    ScheduledUTC: new Date('2023-06-01T06:00:00Z'),
                },
                {
                    FlightID: 789,
                    Diverted: false,
                    FlightNumber: 'HV987',
                    Gate: 8,
                    ScheduledUTC: new Date('2023-06-01T06:00:00Z'),
                },
            ],
        ])('should apply multiple filters correctly: %o', async (filters, expectedResult) => {
            const mockQueryBuilder: any = {
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[expectedResult], 1]),
            };

            repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.findWithFilters(filters, 20, 0);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(Object.keys(filters).length);

            for (const [key, value] of Object.entries(filters)) {
                expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(`f.${key} = :${key}`, { [key]: value });
            }

            expect(result).toEqual({
                data: [expectedResult],
                total: 1,
            });
        });


        it.each([
            -1,
            -10,
            -999,
        ])('should throw error for invalid negative limit: %i', async (limit) => {
            await expect(service.findWithFilters({}, limit, 0)).rejects.toThrow('Limit and offset must be non-negative');
        });

        it.each([
            -1,
            -20,
            -999,
        ])('should throw error for invalid negative offset: %i', async (offset) => {
            await expect(service.findWithFilters({}, 10, offset)).rejects.toThrow('Limit and offset must be non-negative');
        });

    });

    describe('getAllFlightIDs', () => {
        it('should return flight IDs and total count', async () => {
            const mockSelectQuery = {
                select: jest.fn().mockReturnThis(),
                distinct: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([
                    { f_FlightID: 1001 },
                    { f_FlightID: 1002 },
                ]),
            };

            const mockCountQuery = {
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue({ count: '100' }),
            };

            const createQueryBuilder = jest
                .fn()
                .mockImplementationOnce(() => mockSelectQuery)
                .mockImplementationOnce(() => mockCountQuery);

            repo.createQueryBuilder = createQueryBuilder as any;

            const result = await service.getAllFlightIDs(2, 0);

            expect(result).toEqual({
                flightIDs: [1001, 1002],
                total: 100,
            });
        });

        it('should throw if f_FlightID is missing in one or more DB rows', async () => {
            const mockSelectQuery = {
                select: jest.fn().mockReturnThis(),
                distinct: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([
                    {}, // ontbreekt f_FlightID
                    { f_FlightID: 1002 },
                ]),
            };

            const mockCountQuery = {
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue({ count: '2' }),
            };

            const createQueryBuilder = jest
                .fn()
                .mockImplementationOnce(() => mockSelectQuery)
                .mockImplementationOnce(() => mockCountQuery);

            repo.createQueryBuilder = createQueryBuilder as any;

            await expect(service.getAllFlightIDs(2, 0)).rejects.toThrow(
                'Missing FlightID in DB result'
            );
        });

        it('should throw if t_FlightID is missing in one or more DB rows', async () => {
            const mockSelectQuery = {
                select: jest.fn().mockReturnThis(),
                distinct: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([
                    {}, // ontbreekt t_FlightID
                    { t_FlightID: 1002 },
                ]),
            };

            const mockCountQuery = {
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue({ count: '2' }),
            };

            const createQueryBuilder = jest
                .fn()
                .mockImplementationOnce(() => mockSelectQuery)
                .mockImplementationOnce(() => mockCountQuery);

            repo.createQueryBuilder = createQueryBuilder as any;

            await expect(service.getAllFlightIDs(2, 0)).rejects.toThrow(
                'Missing FlightID in DB result'
            );
        });
    });
});
