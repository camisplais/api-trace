import { Test, TestingModule } from '@nestjs/testing';
import { TransportesController } from './transportes.controller';
import { TransportesService } from './transportes.service';

describe('TransportesController', () => {
  let controller: TransportesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportesController],
      providers: [TransportesService],
    }).compile();

    controller = module.get<TransportesController>(TransportesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
