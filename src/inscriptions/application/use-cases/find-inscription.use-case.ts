import { Injectable } from '@nestjs/common';
import { InscriptionsRepository } from '../../domain/repositories/inscriptions.repository';

@Injectable()
export class FindInscriptionUseCase {
  constructor(
    private readonly inscriptionsRepository: InscriptionsRepository,
  ) {}

  execute(id: number) {
    return this.inscriptionsRepository.findOne(id);
  }
}
