import { Injectable } from '@nestjs/common';
import { CreateInscriptionDto } from './application/dto/create-inscription.dto';
import { UpdateInscriptionDto } from './application/dto/update-inscription.dto';
import { CreateInscriptionUseCase } from './application/use-cases/create-inscription.use-case';
import { FindAllInscriptionsUseCase } from './application/use-cases/find-all-inscriptions.use-case';
import { FindInscriptionUseCase } from './application/use-cases/find-inscription.use-case';
import { UpdateInscriptionUseCase } from './application/use-cases/update-inscription.use-case';

@Injectable()
export class InscriptionsService {
  constructor(
    private readonly findAllInscriptionsUseCase: FindAllInscriptionsUseCase,
    private readonly findInscriptionUseCase: FindInscriptionUseCase,
    private readonly createInscriptionUseCase: CreateInscriptionUseCase,
    private readonly updateInscriptionUseCase: UpdateInscriptionUseCase,
  ) {}

  findAll() {
    return this.findAllInscriptionsUseCase.execute();
  }

  findOne(id: number) {
    return this.findInscriptionUseCase.execute(id);
  }

  create(data: CreateInscriptionDto) {
    return this.createInscriptionUseCase.execute(data);
  }

  update(id: number, data: UpdateInscriptionDto) {
    return this.updateInscriptionUseCase.execute(id, data);
  }
}
