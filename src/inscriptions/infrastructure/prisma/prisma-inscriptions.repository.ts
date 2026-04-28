import { Injectable, NotFoundException } from '@nestjs/common';
import { handlePrismaError } from '../../../prisma/prisma-error.mapper';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateInscriptionData,
  InscriptionsRepository,
  UpdateInscriptionData,
} from '../../domain/repositories/inscriptions.repository';

@Injectable()
export class PrismaInscriptionsRepository implements InscriptionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
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

  async findOne(id: number) {
    const inscription = await this.prisma.user.findUnique({
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

    if (!inscription) {
      throw new NotFoundException('No se encontro la inscripcion.');
    }

    return inscription;
  }

  async create(data: CreateInscriptionData) {
    try {
      return await this.prisma.user.create({
        data: {
          nombres: data.nombres,
          apellido_paterno: data.apellido_paterno,
          apellido_materno: data.apellido_materno,
          dni: data.dni,
          celular: data.celular,
          email: data.email,
          team: {
            create: {
              nombre: data.nombre_equipo,
              categoryId: data.categoriaId,
              professionalCollegeId: data.colegioProfesionalId,
            },
          },
        },
        include: {
          team: {
            include: {
              category: true,
              professionalCollege: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error, 'inscripcion');
    }
  }

  async update(id: number, data: UpdateInscriptionData) {
    try {
      const {
        nombre_equipo,
        categoriaId,
        colegioProfesionalId,
        ...userData
      } = data;

      const inscription = await this.prisma.user.update({
        where: { id },
        data: userData,
        include: {
          team: {
            include: {
              category: true,
              professionalCollege: true,
            },
          },
        },
      });

      if (
        nombre_equipo === undefined &&
        categoriaId === undefined &&
        colegioProfesionalId === undefined
      ) {
        return inscription;
      }

      const team = inscription.team;

      if (!team) {
        return await this.prisma.user.update({
          where: { id },
          data: {
            team: {
              create: {
                nombre: nombre_equipo ?? 'Equipo sin nombre',
                categoryId: categoriaId,
                professionalCollegeId: colegioProfesionalId,
              },
            },
          },
          include: {
            team: {
              include: {
                category: true,
                professionalCollege: true,
              },
            },
          },
        });
      }

      await this.prisma.team.update({
        where: { id: team.id },
        data: {
          nombre: nombre_equipo,
          categoryId: categoriaId,
          professionalCollegeId: colegioProfesionalId,
        },
      });

      return await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          team: {
            include: {
              category: true,
              professionalCollege: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error, 'inscripcion');
    }
  }
}
