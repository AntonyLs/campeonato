import { Injectable } from '@nestjs/common';
import { InscriptionsRepository } from '../../domain/repositories/inscriptions.repository';

@Injectable()
export class FindAllInscriptionsUseCase {
  constructor(
    private readonly inscriptionsRepository: InscriptionsRepository,
  ) {}

  execute() {
    return this.inscriptionsRepository.findAll();
  }
}
