import { Test, TestingModule } from '@nestjs/testing';
import { ViajeEmbarqueController } from './viaje_embarque.controller';
import { ViajeEmbarqueService } from './viaje_embarque.service';

describe('ViajeEmbarqueController', () => {
  let controller: ViajeEmbarqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViajeEmbarqueController],
      providers: [ViajeEmbarqueService],
    }).compile();

    controller = module.get<ViajeEmbarqueController>(ViajeEmbarqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
