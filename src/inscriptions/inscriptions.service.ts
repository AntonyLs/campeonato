import { Injectable } from '@nestjs/common';
import { CreateInscriptionDto } from './application/dto/create-inscription.dto';
import { RecoverInscriptionAccessDto } from './application/dto/recover-inscription-access.dto';
import { UpdateInscriptionDto } from './application/dto/update-inscription.dto';
import { VerifyInscriptionAccessDto } from './application/dto/verify-inscription-access.dto';
import { CreateInscriptionUseCase } from './application/use-cases/create-inscription.use-case';
import { FindAllInscriptionsUseCase } from './application/use-cases/find-all-inscriptions.use-case';
import { FindInscriptionByTokenUseCase } from './application/use-cases/find-inscription-by-token.use-case';
import { FindInscriptionUseCase } from './application/use-cases/find-inscription.use-case';
import { RecoverInscriptionAccessUseCase } from './application/use-cases/recover-inscription-access.use-case';
import { UpdateInscriptionUseCase } from './application/use-cases/update-inscription.use-case';
import { AuthService } from '../auth/auth.service';
import { ResendMailService } from '../mail/resend-mail.service';
import { createSessionToken } from '../security/session-token.util';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class InscriptionsService {
  constructor(
    private readonly findAllInscriptionsUseCase: FindAllInscriptionsUseCase,
    private readonly findInscriptionUseCase: FindInscriptionUseCase,
    private readonly findInscriptionByTokenUseCase: FindInscriptionByTokenUseCase,
    private readonly createInscriptionUseCase: CreateInscriptionUseCase,
    private readonly recoverInscriptionAccessUseCase: RecoverInscriptionAccessUseCase,
    private readonly updateInscriptionUseCase: UpdateInscriptionUseCase,
    private readonly authService: AuthService,
    private readonly resendMailService: ResendMailService,
  ) {}

  findAll() {
    return this.findAllInscriptionsUseCase.execute();
  }

  findOne(id: number) {
    return this.findInscriptionUseCase.execute(id);
  }

  findByContinuationToken(token: string) {
    return this.findInscriptionByTokenUseCase.execute(token);
  }

  async create(data: CreateInscriptionDto) {
    const result = await this.createInscriptionUseCase.execute(data);

    const emailDelivery = await this.resendMailService.sendDelegateContinuationEmail(
      {
        to: result.inscription.email,
        delegateName: [
          result.inscription.nombres,
          result.inscription.apellido_paterno,
          result.inscription.apellido_materno,
        ].join(' '),
        teamName: result.inscription.team?.nombre ?? data.nombre_equipo,
        link: result.continuationAccess.link,
        expiresAt: result.continuationAccess.expiresAt,
      },
    );

    return {
      ...result,
      emailDelivery,
    };
  }

  async recoverAccess(data: RecoverInscriptionAccessDto) {
    const continuationAccess =
      await this.recoverInscriptionAccessUseCase.execute(data.dni, data.email);

    const inscription = await this.findInscriptionByTokenUseCase.execute(
      continuationAccess.token,
    );

    const emailDelivery = await this.resendMailService.sendDelegateContinuationEmail(
      {
        to: inscription.email,
        delegateName: [
          inscription.nombres,
          inscription.apellido_paterno,
          inscription.apellido_materno,
        ].join(' '),
        teamName: inscription.team?.nombre ?? 'Equipo registrado',
        link: continuationAccess.link,
        expiresAt: continuationAccess.expiresAt,
      },
    );

    return {
      continuationAccess,
      emailDelivery,
    };
  }

  async verifyAccess(data: VerifyInscriptionAccessDto) {
    const inscription = await this.findInscriptionByTokenUseCase.execute(
      data.token,
    );

    if (inscription.dni !== data.dni) {
      throw new UnauthorizedException('Los datos de acceso no coinciden.');
    }

    return {
      accessToken: createSessionToken(
        {
          sub: 'delegate',
          entityId: inscription.id,
          teamId: inscription.team?.id,
        },
        60 * 60 * 8,
      ),
      inscription,
    };
  }

  getCurrentDelegate(token: string) {
    const payload = this.authService.verifyToken(token, 'delegate');
    return this.findInscriptionUseCase.execute(payload.entityId);
  }

  update(id: number, data: UpdateInscriptionDto) {
    return this.updateInscriptionUseCase.execute(id, data);
  }
}
