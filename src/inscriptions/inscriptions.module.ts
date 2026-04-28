import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { InscriptionsService } from './inscriptions.service';
import { InscriptionsController } from './inscriptions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateInscriptionUseCase } from './application/use-cases/create-inscription.use-case';
import { FindAllInscriptionsUseCase } from './application/use-cases/find-all-inscriptions.use-case';
import { FindInscriptionByTokenUseCase } from './application/use-cases/find-inscription-by-token.use-case';
import { FindInscriptionUseCase } from './application/use-cases/find-inscription.use-case';
import { RecoverInscriptionAccessUseCase } from './application/use-cases/recover-inscription-access.use-case';
import { UpdateInscriptionUseCase } from './application/use-cases/update-inscription.use-case';
import { InscriptionsRepository } from './domain/repositories/inscriptions.repository';
import { PrismaInscriptionsRepository } from './infrastructure/prisma/prisma-inscriptions.repository';

@Module({
  providers: [
    InscriptionsService,
    FindAllInscriptionsUseCase,
    FindInscriptionUseCase,
    FindInscriptionByTokenUseCase,
    CreateInscriptionUseCase,
    RecoverInscriptionAccessUseCase,
    UpdateInscriptionUseCase,
    {
      provide: InscriptionsRepository,
      useClass: PrismaInscriptionsRepository,
    },
  ],
  controllers: [InscriptionsController],
  imports: [PrismaModule, AuthModule, MailModule],
})
export class InscriptionsModule {}
