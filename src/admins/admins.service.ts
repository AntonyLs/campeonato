import { Injectable, NotFoundException } from '@nestjs/common';
import { handlePrismaError } from '../prisma/prisma-error.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../security/hash.util';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const admins = await this.prisma.admin.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return admins.map(({ password, ...admin }) => admin);
  }

  async findOne(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('No se encontro el administrador.');
    }

    const { password, ...sanitizedAdmin } = admin;
    return sanitizedAdmin;
  }

  async create(data: CreateAdminDto) {
    try {
      const admin = await this.prisma.admin.create({
        data: {
          ...data,
          password: hashPassword(data.password),
        },
      });

      const { password, ...sanitizedAdmin } = admin;
      return sanitizedAdmin;
    } catch (error) {
      handlePrismaError(error, 'administrador');
    }
  }

  async update(id: number, data: UpdateAdminDto) {
    try {
      const admin = await this.prisma.admin.update({
        where: { id },
        data: {
          ...data,
          password:
            data.password === undefined
              ? undefined
              : hashPassword(data.password),
        },
      });

      const { password, ...sanitizedAdmin } = admin;
      return sanitizedAdmin;
    } catch (error) {
      handlePrismaError(error, 'administrador');
    }
  }

  async remove(id: number) {
    try {
      const admin = await this.prisma.admin.delete({
        where: { id },
      });

      const { password, ...sanitizedAdmin } = admin;
      return sanitizedAdmin;
    } catch (error) {
      handlePrismaError(error, 'administrador');
    }
  }
}
