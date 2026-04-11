import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(
  error: unknown,
  resourceName = 'registro',
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(', ')
        : 'campo unico';

      throw new ConflictException(`Ya existe un registro con ese ${target}.`);
    }

    if (error.code === 'P2025') {
      throw new NotFoundException(`No se encontro el ${resourceName}.`);
    }
  }

  throw error;
}
