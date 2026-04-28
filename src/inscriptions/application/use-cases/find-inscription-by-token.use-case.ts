import { Injectable } from '@nestjs/common';
import { InscriptionsRepository } from '../../domain/repositories/inscriptions.repository';

@Injectable()
export class FindInscriptionByTokenUseCase {
  constructor(private readonly inscriptionsRepository: InscriptionsRepository) {}

  execute(token: string) {
    return this.inscriptionsRepository.findByContinuationToken(token);
  }
}
