import { Module } from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { InscriptionsController } from './inscriptions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateInscriptionUseCase } from './application/use-cases/create-inscription.use-case';
import { FindAllInscriptionsUseCase } from './application/use-cases/find-all-inscriptions.use-case';
import { FindInscriptionUseCase } from './application/use-cases/find-inscription.use-case';
import { UpdateInscriptionUseCase } from './application/use-cases/update-inscription.use-case';
import { InscriptionsRepository } from './domain/repositories/inscriptions.repository';
import { PrismaInscriptionsRepository } from './infrastructure/prisma/prisma-inscriptions.repository';

@Module({
  providers: [
    InscriptionsService,
    FindAllInscriptionsUseCase,
    FindInscriptionUseCase,
    CreateInscriptionUseCase,
    UpdateInscriptionUseCase,
    {
      provide: InscriptionsRepository,
      useClass: PrismaInscriptionsRepository,
    },
  ],
  controllers: [InscriptionsController],
  imports: [PrismaModule],
})
export class InscriptionsModule {}
