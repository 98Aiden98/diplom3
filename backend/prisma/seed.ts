import { PrismaClient, Gender, Role, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const forceSeed = process.argv.includes('--force');

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const shiftDate = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDate(date);
};

async function main() {
  const existingUsersCount = await prisma.user.count();

  if (existingUsersCount > 0 && !forceSeed) {
    console.log('База уже содержит данные. Seed пропущен.');
    return;
  }

  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.medicalService.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.user.deleteMany();

  const hash = (password: string) => bcrypt.hash(password, 10);

  const adminUser = await prisma.user.create({
    data: {
      fullName: 'Системный администратор',
      email: 'admin@infomed.local',
      passwordHash: await hash('Admin123!'),
      role: Role.ADMIN,
      phone: '+79990000001',
    },
  });

  const registrarUser = await prisma.user.create({
    data: {
      fullName: 'Ольга Регистратор',
      email: 'registrar@infomed.local',
      passwordHash: await hash('Registrar123!'),
      role: Role.REGISTRAR,
      phone: '+79990000002',
    },
  });

  const [therapy, cardiology, neurology] = await Promise.all([
    prisma.specialization.create({
      data: {
        name: 'Терапия',
        description: 'Первичный приём, маршрутизация и ведение пациентов.',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Кардиология',
        description: 'Диагностика и лечение сердечно-сосудистых заболеваний.',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Неврология',
        description: 'Диагностика и лечение неврологических нарушений.',
      },
    }),
  ]);

  const doctorUsers = await Promise.all([
    prisma.user.create({
      data: {
        fullName: 'Елена Воронова',
        email: 'doctor.terap@infomed.local',
        passwordHash: await hash('Doctor123!'),
        role: Role.DOCTOR,
        phone: '+79990000011',
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Андрей Мартынов',
        email: 'doctor.cardio@infomed.local',
        passwordHash: await hash('Doctor123!'),
        role: Role.DOCTOR,
        phone: '+79990000012',
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Марина Филиппова',
        email: 'doctor.neuro@infomed.local',
        passwordHash: await hash('Doctor123!'),
        role: Role.DOCTOR,
        phone: '+79990000013',
      },
    }),
  ]);

  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        userId: doctorUsers[0].id,
        fullName: doctorUsers[0].fullName,
        specializationId: therapy.id,
        phone: doctorUsers[0].phone!,
        email: doctorUsers[0].email,
        photoUrl: '/uploads/doctors/doctor-therapy.svg',
        cabinetNumber: '101',
        experienceYears: 12,
        description: 'Ведёт амбулаторный приём и хронических пациентов.',
      },
    }),
    prisma.doctor.create({
      data: {
        userId: doctorUsers[1].id,
        fullName: doctorUsers[1].fullName,
        specializationId: cardiology.id,
        phone: doctorUsers[1].phone!,
        email: doctorUsers[1].email,
        photoUrl: '/uploads/doctors/doctor-cardio.svg',
        cabinetNumber: '202',
        experienceYears: 15,
        description: 'Кардиолог со специализацией по профилактике и реабилитации.',
      },
    }),
    prisma.doctor.create({
      data: {
        userId: doctorUsers[2].id,
        fullName: doctorUsers[2].fullName,
        specializationId: neurology.id,
        phone: doctorUsers[2].phone!,
        email: doctorUsers[2].email,
        photoUrl: '/uploads/doctors/doctor-neuro.svg',
        cabinetNumber: '303',
        experienceYears: 9,
        description: 'Невролог с практикой ведения пациентов после инсульта.',
      },
    }),
  ]);

  const services = await Promise.all([
    prisma.medicalService.create({
      data: {
        name: 'Первичный приём терапевта',
        description: 'Сбор анамнеза, осмотр и первичные назначения.',
        price: 2200,
        durationMinutes: 30,
        specializationId: therapy.id,
      },
    }),
    prisma.medicalService.create({
      data: {
        name: 'Повторный приём терапевта',
        description: 'Контроль лечения и корректировка рекомендаций.',
        price: 1800,
        durationMinutes: 20,
        specializationId: therapy.id,
      },
    }),
    prisma.medicalService.create({
      data: {
        name: 'Консультация кардиолога',
        description: 'Анализ факторов риска и подбор терапии.',
        price: 2800,
        durationMinutes: 30,
        specializationId: cardiology.id,
      },
    }),
    prisma.medicalService.create({
      data: {
        name: 'Консультация невролога',
        description: 'Диагностика болевых синдромов и неврологических нарушений.',
        price: 2600,
        durationMinutes: 30,
        specializationId: neurology.id,
      },
    }),
  ]);

  const patientUsers = await Promise.all([
    prisma.user.create({
      data: {
        fullName: 'Иван Пациент',
        email: 'patient1@infomed.local',
        passwordHash: await hash('Patient123!'),
        role: Role.PATIENT,
        phone: '+79990000101',
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Анна Пациент',
        email: 'patient2@infomed.local',
        passwordHash: await hash('Patient123!'),
        role: Role.PATIENT,
        phone: '+79990000102',
      },
    }),
  ]);

  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        userId: patientUsers[0].id,
        fullName: patientUsers[0].fullName,
        birthDate: '1994-03-17',
        gender: Gender.MALE,
        phone: patientUsers[0].phone!,
        email: patientUsers[0].email,
        address: 'Москва, Ленинский проспект, 15',
        policyNumber: 'POL-1001',
        passportNumber: '4510123456',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[1].id,
        fullName: patientUsers[1].fullName,
        birthDate: '1988-09-02',
        gender: Gender.FEMALE,
        phone: patientUsers[1].phone!,
        email: patientUsers[1].email,
        address: 'Москва, ул. Маршала Бирюзова, 8',
        policyNumber: 'POL-1002',
        passportNumber: '4509987654',
      },
    }),
    prisma.patient.create({
      data: {
        fullName: 'Пётр Сидоров',
        birthDate: '1979-01-11',
        gender: Gender.MALE,
        phone: '+79990000103',
        email: 'petrov.sidorov@example.com',
        address: 'Химки, ул. Молодёжная, 12',
        policyNumber: 'POL-1003',
        passportNumber: '4509123098',
      },
    }),
    prisma.patient.create({
      data: {
        fullName: 'Мария Лебедева',
        birthDate: '2001-06-30',
        gender: Gender.FEMALE,
        phone: '+79990000104',
        email: 'm.lebedeva@example.com',
        address: 'Мытищи, Олимпийский проспект, 3',
        policyNumber: 'POL-1004',
        passportNumber: '4509456789',
      },
    }),
    prisma.patient.create({
      data: {
        fullName: 'Дмитрий Колесов',
        birthDate: '1967-12-08',
        gender: Gender.MALE,
        phone: '+79990000105',
        email: 'd.kolesov@example.com',
        address: 'Москва, ул. Академика Королёва, 22',
        policyNumber: 'POL-1005',
        passportNumber: '4509345612',
      },
    }),
  ]);

  await Promise.all(
    doctors.flatMap((doctor, index) =>
      [1, 2, 3, 4, 5].map((day) =>
        prisma.doctorSchedule.create({
          data: {
            doctorId: doctor.id,
            dayOfWeek: day,
            startTime: index === 0 ? '09:00' : index === 1 ? '10:00' : '11:00',
            endTime: index === 0 ? '16:00' : index === 1 ? '17:00' : '18:00',
            cabinetNumber: doctor.cabinetNumber,
            isActive: true,
          },
        }),
      ),
    ),
  );

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        serviceId: services[0].id,
        date: shiftDate(1),
        startTime: '10:00',
        endTime: '10:30',
        status: AppointmentStatus.PLANNED,
        reason: 'Профилактический осмотр',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctors[1].id,
        serviceId: services[2].id,
        date: shiftDate(0),
        startTime: '12:00',
        endTime: '12:30',
        status: AppointmentStatus.PLANNED,
        reason: 'Нестабильное давление',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctors[2].id,
        serviceId: services[3].id,
        date: shiftDate(-2),
        startTime: '11:00',
        endTime: '11:30',
        status: AppointmentStatus.COMPLETED,
        reason: 'Головокружение',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[3].id,
        doctorId: doctors[0].id,
        serviceId: services[1].id,
        date: shiftDate(-5),
        startTime: '14:00',
        endTime: '14:20',
        status: AppointmentStatus.COMPLETED,
        reason: 'Контроль лечения',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[4].id,
        doctorId: doctors[1].id,
        serviceId: services[2].id,
        date: shiftDate(3),
        startTime: '15:00',
        endTime: '15:30',
        status: AppointmentStatus.CANCELLED,
        reason: 'Боль в груди',
      },
    }),
  ]);

  await Promise.all([
    prisma.medicalRecord.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctors[2].id,
        appointmentId: appointments[2].id,
        complaints: 'Головокружение и онемение в области шеи.',
        diagnosis: 'Цервикокраниалгия.',
        treatment: 'Медикаментозная терапия и курс ЛФК.',
        recommendations: 'Избегать длительной статической нагрузки, контроль через 14 дней.',
        prescriptions: 'Мидокалм, витамин B-комплекс.',
      },
    }),
    prisma.medicalRecord.create({
      data: {
        patientId: patients[3].id,
        doctorId: doctors[0].id,
        appointmentId: appointments[3].id,
        complaints: 'Слабость и остаточный кашель после ОРВИ.',
        diagnosis: 'Период выздоровления после ОРВИ.',
        treatment: 'Симптоматическая терапия, домашний режим.',
        recommendations: 'Соблюдать водный баланс, контроль температуры 3 дня.',
        prescriptions: 'Амброксол, витамин C.',
      },
    }),
  ]);

  console.log('Тестовые данные успешно загружены');
  console.log(`Администратор: ${adminUser.email} / Admin123!`);
  console.log(`Регистратор: ${registrarUser.email} / Registrar123!`);
  console.log(`Врач: ${doctorUsers[0].email} / Doctor123!`);
  console.log(`Пациент: ${patientUsers[0].email} / Patient123!`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
