import { Test, TestingModule } from '@nestjs/testing';
import { InscriptionsService } from './inscriptions.service';
import { CreateInscriptionUseCase } from './application/use-cases/create-inscription.use-case';
import { FindAllInscriptionsUseCase } from './application/use-cases/find-all-inscriptions.use-case';
import { FindInscriptionUseCase } from './application/use-cases/find-inscription.use-case';
import { UpdateInscriptionUseCase } from './application/use-cases/update-inscription.use-case';

describe('InscriptionsService', () => {
  let service: InscriptionsService;
  const createInscriptionUseCase = {
    execute: jest.fn(),
  };
  const findAllInscriptionsUseCase = {
    execute: jest.fn(),
  };
  const findInscriptionUseCase = {
    execute: jest.fn(),
  };
  const updateInscriptionUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InscriptionsService,
        {
          provide: FindAllInscriptionsUseCase,
          useValue: findAllInscriptionsUseCase,
        },
        {
          provide: FindInscriptionUseCase,
          useValue: findInscriptionUseCase,
        },
        {
          provide: CreateInscriptionUseCase,
          useValue: createInscriptionUseCase,
        },
        {
          provide: UpdateInscriptionUseCase,
          useValue: updateInscriptionUseCase,
        },
      ],
    }).compile();

    service = module.get<InscriptionsService>(InscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
