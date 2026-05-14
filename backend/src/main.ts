import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

const fieldLabels: Record<string, string> = {
  fullName: 'ФИО',
  email: 'email',
  password: 'пароль',
  phone: 'телефон',
  birthDate: 'дата рождения',
  gender: 'пол',
  address: 'адрес',
  policyNumber: 'номер полиса',
  passportNumber: 'паспорт',
  role: 'роль',
  specializationId: 'специальность',
  cabinetNumber: 'кабинет',
  experienceYears: 'стаж',
  description: 'описание',
  patientId: 'пациент',
  doctorId: 'врач',
  serviceId: 'услуга',
  date: 'дата',
  startTime: 'время начала',
  endTime: 'время окончания',
  appointmentId: 'приём',
  complaints: 'жалобы',
  diagnosis: 'диагноз',
  treatment: 'лечение',
  recommendations: 'рекомендации',
  prescriptions: 'назначения',
  dayOfWeek: 'день недели',
  isActive: 'статус активности',
  query: 'поисковый запрос',
};

const getFieldLabel = (property: string) => fieldLabels[property] ?? property;

const mapConstraintMessage = (property: string, constraint: string) => {
  const label = getFieldLabel(property);

  switch (constraint) {
    case 'isEmail':
      return `Поле "${label}" должно содержать корректный email.`;
    case 'isString':
      return `Поле "${label}" должно быть строкой.`;
    case 'isInt':
      return `Поле "${label}" должно быть целым числом.`;
    case 'isEnum':
      return `Поле "${label}" содержит недопустимое значение.`;
    case 'minLength':
      return `Поле "${label}" заполнено слишком коротко.`;
    case 'min':
      return `Поле "${label}" содержит слишком маленькое значение.`;
    case 'isDateString':
      return `Поле "${label}" должно содержать корректную дату.`;
    case 'isBoolean':
      return `Поле "${label}" должно быть булевым значением.`;
    default:
      return `Поле "${label}" заполнено некорректно.`;
  }
};

const collectValidationMessages = (errors: ValidationError[]): string[] =>
  errors.flatMap((error) => {
    const ownMessages = error.constraints
      ? Object.keys(error.constraints).map((constraint) =>
          mapConstraintMessage(error.property, constraint),
        )
      : [];

    const nestedMessages = error.children?.length ? collectValidationMessages(error.children) : [];

    return [...ownMessages, ...nestedMessages];
  });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const defaultCorsOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
  const envCorsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const corsOrigins = [...new Set([...defaultCorsOrigins, ...envCorsOrigins])];

  const uploadsRoot = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsRoot)) {
    mkdirSync(uploadsRoot, { recursive: true });
  }

  app.use('/uploads', express.static(uploadsRoot));

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) =>
        new BadRequestException(
          collectValidationMessages(errors).length
            ? collectValidationMessages(errors)
            : ['Проверьте корректность заполнения полей.'],
        ),
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ИнфоМед API')
    .setDescription('REST API информационной системы медицинского центра ИнфоМед')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
