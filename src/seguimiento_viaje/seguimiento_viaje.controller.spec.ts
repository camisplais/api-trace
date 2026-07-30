import { Test, TestingModule } from '@nestjs/testing';
import { SeguimientoViajeController } from './seguimiento_viaje.controller';
import { SeguimientoViajeService } from './seguimiento_viaje.service';

describe('SeguimientoViajeController', () => {
  let controller: SeguimientoViajeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeguimientoViajeController],
      providers: [SeguimientoViajeService],
    }).compile();

    controller = module.get<SeguimientoViajeController>(SeguimientoViajeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
