import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { RateLimitMiddleware } from 'src/middleware/rate-limit.middleware';

describe('Logging E2E Tests', () => {
    let app: INestApplication;
    let jwtToken: string;

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

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'Admin', password: 'Admin' });

        jwtToken = loginRes.text;
    });

    it('triggert logging via flightExport endpoint', async () => {
        await request(app.getHttpServer())
            .get('/flightExport?limit=1')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);
    });

    it('haalt logs op via /logs', async () => {
        const res = await request(app.getHttpServer())
            .get('/logs')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('laatste log bevat juiste username', async () => {
        const res = await request(app.getHttpServer())
            .get('/logs')
            .set('Authorization', `Bearer ${jwtToken}`);

        const last = res.body.data.at(-1);
        expect(last.username).toBe('Admin');
    });

    it('laatste log bevat Export als database', async () => {
        const res = await request(app.getHttpServer())
            .get('/logs')
            .set('Authorization', `Bearer ${jwtToken}`);

        const last = res.body.data.at(-1);
        expect(last.database).toBe('Export');
    });

    it('laatste log bevat GET als methode', async () => {
        const res = await request(app.getHttpServer())
            .get('/logs')
            .set('Authorization', `Bearer ${jwtToken}`);

        const last = res.body.data.at(-1);
        expect(last.httpMethod).toBe('GET');
    });

    it('laatste log bevat responseCode 200', async () => {
        const res = await request(app.getHttpServer())
            .get('/logs')
            .set('Authorization', `Bearer ${jwtToken}`);

        const last = res.body.data.at(-1);
        expect(last.responseCode).toBe(200);
    });

    it('filter op responseCode=200 levert alleen correcte logs', async () => {
        const res = await request(app.getHttpServer())
            .get('/logs?responseCode=200')
            .set('Authorization', `Bearer ${jwtToken}`);


        console.log(res.body);
        for (const log of res.body.data) {
            expect(log.responseCode).toBe(200);
        }
    });

    it('filter op database=Export levert alleen Export-logs', async () => {
        const res = await request(app.getHttpServer())
            .get('/logs?database=Export')
            .set('Authorization', `Bearer ${jwtToken}`);

        for (const log of res.body.data) {
            expect(log.database).toBe('Export');
        }
    });

    it('filter op httpMethod=GET levert alleen GET-logs', async () => {
        const res = await request(app.getHttpServer())
            .get('/logs?httpMethod=GET')
            .set('Authorization', `Bearer ${jwtToken}`);

        for (const log of res.body.data) {
            expect(log.httpMethod).toBe('GET');
        }
    });

    afterAll(async () => {
        await app.close();
    });
});
