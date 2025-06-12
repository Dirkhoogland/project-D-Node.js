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
                transformOptions: { enableImplicitConversion: false },
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

        jwtToken = res.text;
        expect(typeof jwtToken).toBe('string');
    });

    it('/touchpoints (GET) zonder token → 401', async () => {
        await request(app.getHttpServer()).get('/touchpoints').expect(401);
    });

    it('/touchpoints zonder filters → array met [FlightID, ScheduledLocal, URL]', async () => {
        const res = await request(app.getHttpServer())
            .get('/touchpoints')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);

        const [id, scheduledLocal, url] = res.body.data[0];
        expect(url).toContain(`FlightID=${id}`);
        testFlightID = id;
    });

    const countryFilters = ['Germany', 'Spain', 'Marokko'];

    it.each(countryFilters)(
        '/touchpoints?Country=%s - filtering werkt',
        async (country) => {
            const res = await request(app.getHttpServer())
                .get(`/touchpoints?Country=${country}`)
                .set('Authorization', `Bearer ${jwtToken}`)

            if (res.body.data.length > 0) {
                expect(res.body.data[0].Country.toLowerCase()).toBe(country.toLowerCase());
            }
        },
    );

    it.each(countryFilters)(
        '/touchpoints?Country=%sXYZ - ongeldige country → 404',
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
        '/touchpoints?FlightID=%s - filtering op ID werkt',
        async (flightId) => {
            const res = await request(app.getHttpServer())
                .get(`/touchpoints?FlightID=${flightId}`)
                .set('Authorization', `Bearer ${jwtToken}`)

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

        expect(res.body.data.length).toBeLessThanOrEqual(2);
    });

    it('/touchpoints/:FlightID - geldige ID werkt', async () => {
        const res = await request(app.getHttpServer())
            .get(`/touchpoints/${testFlightID}`)
            .set('Authorization', `Bearer ${jwtToken}`)

        expect(res.body.data.FlightID).toBe(testFlightID);
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
