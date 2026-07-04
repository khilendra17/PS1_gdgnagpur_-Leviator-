import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SwasthyaSetu AI database...');

  // Clean existing data
  await prisma.patient.deleteMany({});
  await prisma.medicine.deleteMany({});

  // Seed Patients
  const patientsData = [
    {
      name: 'Ramesh Kumar',
      age: 45,
      village: 'Ramgarh',
      symptoms: 'High fever and severe body ache for 3 days',
      token: 'A001',
      status: 'SERVING',
    },
    {
      name: 'Sita Devi',
      age: 62,
      village: 'Pipariya',
      symptoms: 'Joint pain and high blood pressure checkup',
      token: 'A002',
      status: 'WAITING',
    },
    {
      name: 'Amit Patel',
      age: 8,
      village: 'Haripura',
      symptoms: 'Cough, cold, and mild breathing difficulty',
      token: 'A003',
      status: 'WAITING',
    },
    {
      name: 'Gopal Prasad',
      age: 34,
      village: 'Sonpur',
      symptoms: 'Stomach infection and dehydration',
      token: 'A004',
      status: 'COMPLETED',
    },
  ];

  for (const patient of patientsData) {
    await prisma.patient.create({ data: patient });
  }

  // Seed Medicines
  const medicinesData = [
    {
      medicineName: 'Paracetamol 500mg',
      expiryDate: '2026-12-15', // Good stock, far expiry (Green/Yellow)
      stock: 120,
    },
    {
      medicineName: 'Amoxicillin 250mg',
      expiryDate: '2026-07-20', // Expiring soon (Yellow alert)
      stock: 45,
    },
    {
      medicineName: 'Metformin 500mg',
      expiryDate: '2025-05-10', // Expired (Red alert)
      stock: 15,
    },
    {
      medicineName: 'Cetirizine 10mg',
      expiryDate: '2027-01-10', // Low stock (Red alert)
      stock: 4,
    },
    {
      medicineName: 'ORS Packets',
      expiryDate: '2027-03-30', // High stock, healthy (Green)
      stock: 250,
    },
  ];

  for (const medicine of medicinesData) {
    await prisma.medicine.create({ data: medicine });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
