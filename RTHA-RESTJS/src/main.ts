import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new RateLimitMiddleware().use);

  const config = new DocumentBuilder()
    .setTitle('RTHA-TEST-API')
    .setDescription('Testing the API for RTHA')
    .setVersion('Alpha 0.0.3')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt', // name of the security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();