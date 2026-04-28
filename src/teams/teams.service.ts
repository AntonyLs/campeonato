import { Injectable, NotFoundException } from '@nestjs/common';
import { handlePrismaError } from '../prisma/prisma-error.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.team.findMany({
      include: {
        category: true,
        professionalCollege: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        category: true,
        professionalCollege: true,
      },
    });

    if (!team) {
      throw new NotFoundException('No se encontro el equipo.');
    }

    return team;
  }

  findAllWithUsers() {
    return this.prisma.team.findMany({
      include: {
        category: true,
        professionalCollege: true,
        user: true,
        players: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOneWithUser(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        category: true,
        professionalCollege: true,
        user: true,
        players: true,
      },
    });

    if (!team) {
      throw new NotFoundException('No se encontro el equipo.');
    }

    return team;
  }

  async update(id: number, data: UpdateTeamDto) {
    try {
      return await this.prisma.team.update({
        where: { id },
        data,
        include: {
          category: true,
          professionalCollege: true,
        },
      });
    } catch (error) {
      handlePrismaError(error, 'equipo');
    }
  }
}
