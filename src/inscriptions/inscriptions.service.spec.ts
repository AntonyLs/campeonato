import { Test, TestingModule } from '@nestjs/testing';
import { InscriptionsService } from './inscriptions.service';
import { CreateInscriptionUseCase } from './application/use-cases/create-inscription.use-case';
import { FindAllInscriptionsUseCase } from './application/use-cases/find-all-inscriptions.use-case';
import { FindInscriptionByTokenUseCase } from './application/use-cases/find-inscription-by-token.use-case';
import { FindInscriptionUseCase } from './application/use-cases/find-inscription.use-case';
import { RecoverInscriptionAccessUseCase } from './application/use-cases/recover-inscription-access.use-case';
import { UpdateInscriptionUseCase } from './application/use-cases/update-inscription.use-case';
import { AuthService } from '../auth/auth.service';
import { ResendMailService } from '../mail/resend-mail.service';

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
  const findInscriptionByTokenUseCase = {
    execute: jest.fn(),
  };
  const recoverInscriptionAccessUseCase = {
    execute: jest.fn(),
  };
  const updateInscriptionUseCase = {
    execute: jest.fn(),
  };
  const authService = {
    verifyToken: jest.fn(),
  };
  const resendMailService = {
    sendDelegateContinuationEmail: jest.fn(),
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
          provide: FindInscriptionByTokenUseCase,
          useValue: findInscriptionByTokenUseCase,
        },
        {
          provide: CreateInscriptionUseCase,
          useValue: createInscriptionUseCase,
        },
        {
          provide: RecoverInscriptionAccessUseCase,
          useValue: recoverInscriptionAccessUseCase,
        },
        {
          provide: UpdateInscriptionUseCase,
          useValue: updateInscriptionUseCase,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: ResendMailService,
          useValue: resendMailService,
        },
      ],
    }).compile();

    service = module.get<InscriptionsService>(InscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
