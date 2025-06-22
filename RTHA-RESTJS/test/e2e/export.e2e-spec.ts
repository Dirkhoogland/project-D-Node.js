import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { RateLimitMiddleware } from 'src/middleware/rate-limit.middleware';

describe('Auth & FlightExport E2E (read-only, live DB)', () => {
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

  it('/flightExport (GET) zonder token → 401', async () => {
    await request(app.getHttpServer())
      .get('/flightExport')
      .expect(401);
  });

  it('/flightExport (GET) met geldige JWT → 200 + data array', async () => {
    const res = await request(app.getHttpServer())
      .get('/flightExport')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  let testFlightID: number;

  it('/flightExport zonder filters → geeft array met [FlightID, URL]', async () => {
    const res = await request(app.getHttpServer())
      .get('/flightExport')
      .set('Authorization', `Bearer ${jwtToken}`)

    const item = res.body.data[0];
    expect(item.url).toContain(`FlightID=${item.FlightID}`);
    testFlightID = item.FlightID;
  });

  const booleanFilters = [
    { name: 'Diverted', valid: true },
    { name: 'Nachtvlucht', valid: true },
    { name: 'PublicAnnouncement', valid: true },
  ];

  it.each(booleanFilters)(
    '/flightExport?%s=true - filtering werkt',
    async ({ name, valid }) => {
      const res = await request(app.getHttpServer())
        .get(`/flightExport?${name}=true`)
        .set('Authorization', `Bearer ${jwtToken}`)


      if (res.body.data.length > 0) {
        expect(res.body.data[0][name]).toBe(valid);
      }
    },
  );

  it.each(booleanFilters)(
    '/flightExport?%s=xyz - ongeldige filter',
    async ({ name }) => {
      await request(app.getHttpServer())
        .get(`/flightExport?${name}=xyz`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(400);
    },
  );

  const countryFilters = ['Germany', 'Spain', 'Marokko'];

  it.each(countryFilters)(
    '/flightExport?Country=%s - filtering werkt',
    async (country) => {
      const res = await request(app.getHttpServer())
        .get(`/flightExport?Country=${country}`)
        .set('Authorization', `Bearer ${jwtToken}`)

      if (res.body.data.length > 0) {
        expect(res.body.data[0].Country.toLowerCase()).toBe(country.toLowerCase());
      }
    },
  );

  it.each(countryFilters)(
    '/flightExport?Country=%sxyz - ongeldige country filter geeft 404',
    async (country) => {
      const bogus = `${country}xyz`;
      await request(app.getHttpServer())
        .get(`/flightExport?Country=${bogus}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    },
  );

  const flightIdFilters = [580265, 585159, 585239];

  it.each(flightIdFilters)(
    '/flightExport?FlightID=%s - filtering op FlightID werkt',
    async (flightId) => {
      const res = await request(app.getHttpServer())
        .get(`/flightExport?FlightID=${flightId}`)
        .set('Authorization', `Bearer ${jwtToken}`)

      expect(res.body.data[0].FlightID).toBe(flightId);
    },
  );

  it.each(flightIdFilters)(
    '/flightExport?FlightID=%s999 - ongeldige FlightID geeft 404',
    async (flightId) => {
      const BadId = flightId * 1000;
      await request(app.getHttpServer())
        .get(`/flightExport?FlightID=${BadId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    },
  );

  it('/flightExport?limit=2&offset=0 - paginatie werkt', async () => {
    const res = await request(app.getHttpServer())
      .get('/flightExport?limit=2&offset=0')
      .set('Authorization', `Bearer ${jwtToken}`)

    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });

  it('/flightExport/:id - geldige ID werkt', async () => {
    const res = await request(app.getHttpServer())
      .get(`/flightExport/${testFlightID}`)
      .set('Authorization', `Bearer ${jwtToken}`)

    expect(res.body.data.FlightID).toBe(testFlightID);
  });

  it('/flightExport/:id - zonder token → 401', async () => {
    await request(app.getHttpServer())
      .get(`/flightExport/${testFlightID}`)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
