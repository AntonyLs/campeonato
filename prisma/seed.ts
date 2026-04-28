import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/security/hash.util';

const prisma = new PrismaClient();

async function main() {
  const correo = process.env.SEED_ADMIN_EMAIL ?? 'admin@gmail.com';
  const dni = process.env.SEED_ADMIN_DNI ?? '12345678';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'campeonato2026';

  const existing = await prisma.admin.findFirst({
    where: { OR: [{ correo }, { dni }] },
  });

  if (existing) {
    console.log(`[seed] Admin ya existe (id=${existing.id}, correo=${existing.correo}). Skip.`);
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      organizador: process.env.SEED_ADMIN_ORG ?? 'Comite Central',
      correo,
      dni,
      nro_celular: process.env.SEED_ADMIN_PHONE ?? '999888777',
      password: hashPassword(password),
    },
  });

  console.log(`[seed] Admin creado:`);
  console.log(`  id:       ${admin.id}`);
  console.log(`  correo:   ${admin.correo}`);
  console.log(`  dni:      ${admin.dni}`);
  console.log(`  password: ${password}  (cambiala despues)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
