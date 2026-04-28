import { Injectable } from '@nestjs/common';
import { InscriptionsRepository } from '../../domain/repositories/inscriptions.repository';

@Injectable()
export class RecoverInscriptionAccessUseCase {
  constructor(private readonly inscriptionsRepository: InscriptionsRepository) {}

  execute(dni: string, email: string) {
    return this.inscriptionsRepository.recoverContinuationAccess(dni, email);
  }
}
