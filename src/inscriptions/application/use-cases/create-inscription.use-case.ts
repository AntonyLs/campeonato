import { Injectable } from '@nestjs/common';
import {
  CreateInscriptionData,
  InscriptionsRepository,
} from '../../domain/repositories/inscriptions.repository';

@Injectable()
export class CreateInscriptionUseCase {
  constructor(
    private readonly inscriptionsRepository: InscriptionsRepository,
  ) {}

  execute(data: CreateInscriptionData) {
    return this.inscriptionsRepository.create(data);
  }
}
