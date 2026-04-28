import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfessionalCollegesController } from './professional-colleges.controller';
import { ProfessionalCollegesService } from './professional-colleges.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProfessionalCollegesController],
  providers: [ProfessionalCollegesService],
})
export class ProfessionalCollegesModule {}
