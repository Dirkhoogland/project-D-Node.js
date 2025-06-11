import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { RateLimitMiddleware } from 'src/middleware/rate-limit.middleware';

describe('Auth & Touchpoints E2E (read-only, live DB)', () => {
    let app: INestApplication;
    let jwtToken: string;
    let testFlightID: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: {
                    enableImplicitConversion: false,
                },
                skipMissingProperties: true,
            }),
        );

        app.use(new RateLimitMiddleware().use);

        await app.init();
    });

    it('/auth/login (POST) - krijgt JWT token', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'Admin', password: 'Admin' })
            .expect(201);

        expect(typeof res.text).toBe('string');
        jwtToken = res.text;
    });

    it('/touchpoints (GET) zonder token → 401', async () => {
        await request(app.getHttpServer()).get('/touchpoints').expect(401);
    });

    it('/touchpoints zonder filters → geeft array met [FlightID, ScheduledLocal, URL]', async () => {
        const res = await request(app.getHttpServer())
            .get('/touchpoints')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);

        const firstEntry = res.body.data[0];

        expect(Array.isArray(firstEntry)).toBe(true);
        expect(firstEntry.length).toBeGreaterThanOrEqual(2);

        const [id, scheduledLocal, url] = firstEntry;

        expect(typeof id).toBe('number');
        expect(typeof url).toBe('string');
        expect(url).toContain(`FlightID=${id}`);

        expect(scheduledLocal).toBeDefined();
        expect(new Date(scheduledLocal).toString()).not.toBe('Invalid Date');

        testFlightID = id;
    });

    const countryFilters = ['Germany', 'Spain', 'Marokko'];

    it.each(countryFilters)(
        '/touchpoints?Country=%s - filtering werkt',
        async (country) => {
            const res = await request(app.getHttpServer())
                .get(`/touchpoints?Country=${country}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(200);

            expect(Array.isArray(res.body.data)).toBe(true);
            if (res.body.data.length > 0) {
                expect(res.body.data[0].Country.toLowerCase()).toBe(country.toLowerCase());
            }
        },
    );

    it.each(countryFilters)(
        '/touchpoints?Country=%sXYZ - ongeldige country filter → 404',
        async (country) => {
            const bogus = `${country}XYZ`;
            await request(app.getHttpServer())
                .get(`/touchpoints?Country=${bogus}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(404);
        },
    );

    const flightIdFilters = [580265, 585159, 585239];

    it.each(flightIdFilters)(
        '/touchpoints?FlightID=%s - filtering op FlightID werkt',
        async (flightId) => {
            const res = await request(app.getHttpServer())
                .get(`/touchpoints?FlightID=${flightId}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(200);

            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0].FlightID).toBe(flightId);
        },
    );

    it.each(flightIdFilters)(
        '/touchpoints?FlightID=%s999 - ongeldige ID → 404',
        async (flightId) => {
            const badId = flightId * 1000;
            await request(app.getHttpServer())
                .get(`/touchpoints?FlightID=${badId}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(404);
        },
    );

    it('/touchpoints?limit=2&offset=0 - paginatie werkt', async () => {
        const res = await request(app.getHttpServer())
            .get('/touchpoints?limit=2&offset=0')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body.data.length).toBeLessThanOrEqual(2);
        expect(res.body).toHaveProperty('nextPage');
    });

    it('/touchpoints/:FlightID - geldige ID werkt', async () => {
        const res = await request(app.getHttpServer())
            .get(`/touchpoints/${testFlightID}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body.data).toHaveProperty('FlightID', testFlightID);
    });

    it('/touchpoints/:FlightID - zonder token → 401', async () => {
        await request(app.getHttpServer())
            .get(`/touchpoints/${testFlightID}`)
            .expect(401);
    });

    afterAll(async () => {
        await app.close();
    });
});
