import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { handlePrismaError } from '../prisma/prisma-error.mapper';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('No se encontro el usuario.');
    }

    return user;
  }

  findAllWithTeam() {
    return this.prisma.user.findMany({
      include: {
        team: {
          include: {
            category: true,
            professionalCollege: true,
            players: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOneWithTeam(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            category: true,
            professionalCollege: true,
            players: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('No se encontro el usuario.');
    }

    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error, 'usuario');
    }
  }
}
