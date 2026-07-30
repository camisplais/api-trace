import { Test, TestingModule } from '@nestjs/testing';
import { PruebaEntregaEmbarqueController } from './prueba_entrega_embarque.controller';
import { PruebaEntregaEmbarqueService } from './prueba_entrega_embarque.service';

describe('PruebaEntregaEmbarqueController', () => {
  let controller: PruebaEntregaEmbarqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PruebaEntregaEmbarqueController],
      providers: [PruebaEntregaEmbarqueService],
    }).compile();

    controller = module.get<PruebaEntregaEmbarqueController>(PruebaEntregaEmbarqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
