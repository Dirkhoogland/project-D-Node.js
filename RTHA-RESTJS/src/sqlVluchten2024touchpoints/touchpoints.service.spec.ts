import { Test, TestingModule } from '@nestjs/testing';
import { TouchpointService } from './touchpoints.service';
import { TouchpointEntity } from './entities/touchpoints.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('TouchpointService', () => {
    let service: TouchpointService;
    let repo: jest.Mocked<Repository<TouchpointEntity>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TouchpointService,
                {
                    provide: getRepositoryToken(TouchpointEntity),
                    useValue: {
                        createQueryBuilder: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TouchpointService>(TouchpointService);
        repo = module.get(getRepositoryToken(TouchpointEntity));
    });

    describe('findOneById', () => {
        it.each([
            [123, { FlightID: 123 }],
            [456, { FlightID: 456 }],
            [789, { FlightID: 789 }],
        ])('should return flight for FlightID %i', async (id, mockFlight) => {
            repo.findOne.mockResolvedValue(mockFlight as TouchpointEntity);

            const result = await service.findOneById(id);

            expect(repo.findOne).toHaveBeenCalledWith({ where: { FlightID: id } });
            expect(result).toEqual(mockFlight);
        });

        it.each([9999999999, 0, -1])(
            'should throw NotFoundException if FlightID %i not found',
            async (id) => {
                repo.findOne.mockResolvedValue(null);

                await expect(service.findOneById(id)).rejects.toThrow('Touchpoint not found');
            },
        );
    });

    describe('findWithFilters', () => {
        it('should build query with filters and return data', async () => {
            const mockQueryBuilder: any = {
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([
                    [{ FlightID: 1, Country: 'Turkey' }],
                    1,
                ]),
            };

            repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const filters = { Country: 'Turkey' };
            const result = await service.findWithFilters(filters, 10, 0);

            expect(repo.createQueryBuilder).toHaveBeenCalledWith('t');
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                't.Country = :Country',
                { Country: 'Turkey' },
            );
            expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
            expect(result).toEqual({
                data: [{ FlightID: 1, Country: 'Turkey' }],
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
                TrafficType: undefined,
                FlightNumber: '',
                Country: null,
            } as any;

            await service.findWithFilters(filters, 10, 0);

            expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
        });

        it.each([
            [
                {
                    FlightID: 111,
                    TimetableID: 222,
                    FlightNumber: 'XQ901',
                    TrafficType: 'A',
                    ScheduledLocal: new Date('2024-01-01T08:00:00Z'),
                    Country: 'Turkey',
                },
                {
                    FlightID: 111,
                    TimetableID: 222,
                    FlightNumber: 'XQ901',
                    TrafficType: 'A',
                    ScheduledLocal: new Date('2024-01-01T08:00:00Z'),
                    Country: 'Turkey',
                },
            ],
            [
                {
                    FlightID: 333,
                    TimetableID: 444,
                    FlightNumber: 'HV123',
                    TrafficType: 'D',
                    ScheduledLocal: new Date('2024-05-15T15:30:00Z'),
                    Country: 'Spain',
                },
                {
                    FlightID: 333,
                    TimetableID: 444,
                    FlightNumber: 'HV123',
                    TrafficType: 'D',
                    ScheduledLocal: new Date('2024-05-15T15:30:00Z'),
                    Country: 'Spain',
                },
            ],
            [
                {
                    FlightID: 555,
                    TimetableID: 666,
                    FlightNumber: 'BA456',
                    TrafficType: 'I',
                    ScheduledLocal: new Date('2024-07-10T22:10:00Z'),
                    Country: 'Marokko',
                },
                {
                    FlightID: 555,
                    TimetableID: 666,
                    FlightNumber: 'BA456',
                    TrafficType: 'I',
                    ScheduledLocal: new Date('2024-07-10T22:10:00Z'),
                    Country: 'Marokko',
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

            expect(repo.createQueryBuilder).toHaveBeenCalledWith('t');
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(Object.keys(filters).length);

            for (const [key, value] of Object.entries(filters)) {
                expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(`t.${key} = :${key}`, { [key]: value });
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
                    { t_FlightID: 585146 },
                    { t_FlightID: 585147 },
                ]),
            };

            const mockCountQuery = {
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue({ count: '200' }),
            };

            const createQueryBuilder = jest
                .fn()
                .mockImplementationOnce(() => mockSelectQuery)
                .mockImplementationOnce(() => mockCountQuery);

            repo.createQueryBuilder = createQueryBuilder as any;

            const result = await service.getAllFlightIDs(2, 0);

            expect(result).toEqual({
                flightIDs: [585146, 585147],
                total: 200,
            });

            expect(mockSelectQuery.getRawMany).toHaveBeenCalled();
            expect(mockCountQuery.getRawOne).toHaveBeenCalled();
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
