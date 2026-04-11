import { Injectable } from '@nestjs/common';
import {
  InscriptionsRepository,
  UpdateInscriptionData,
} from '../../domain/repositories/inscriptions.repository';

@Injectable()
export class UpdateInscriptionUseCase {
  constructor(
    private readonly inscriptionsRepository: InscriptionsRepository,
  ) {}

  execute(id: number, data: UpdateInscriptionData) {
    return this.inscriptionsRepository.update(id, data);
  }
}
