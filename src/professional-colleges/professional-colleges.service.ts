import { Injectable, NotFoundException } from '@nestjs/common';
import { handlePrismaError } from '../prisma/prisma-error.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalCollegeDto } from './dto/create-professional-college.dto';
import { UpdateProfessionalCollegeDto } from './dto/update-professional-college.dto';

@Injectable()
export class ProfessionalCollegesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.professionalCollege.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const professionalCollege = await this.prisma.professionalCollege.findUnique(
      {
        where: { id },
      },
    );

    if (!professionalCollege) {
      throw new NotFoundException(
        'No se encontro el colegio profesional.',
      );
    }

    return professionalCollege;
  }

  async create(data: CreateProfessionalCollegeDto) {
    try {
      return await this.prisma.professionalCollege.create({
        data,
      });
    } catch (error) {
      handlePrismaError(error, 'colegio profesional');
    }
  }

  async update(id: number, data: UpdateProfessionalCollegeDto) {
    try {
      return await this.prisma.professionalCollege.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error, 'colegio profesional');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.professionalCollege.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error, 'colegio profesional');
    }
  }
}
