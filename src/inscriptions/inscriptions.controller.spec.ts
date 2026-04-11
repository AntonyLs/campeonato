import { Test, TestingModule } from '@nestjs/testing';
import { InscriptionsController } from './inscriptions.controller';
import { InscriptionsService } from './inscriptions.service';

describe('InscriptionsController', () => {
  let controller: InscriptionsController;
  const inscriptionsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscriptionsController],
      providers: [
        {
          provide: InscriptionsService,
          useValue: inscriptionsService,
        },
      ],
    }).compile();

    controller = module.get<InscriptionsController>(InscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
