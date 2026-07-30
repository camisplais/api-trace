import { Test, TestingModule } from '@nestjs/testing';
import { PruebaEntregaEmbarqueService } from './prueba_entrega_embarque.service';

describe('PruebaEntregaEmbarqueService', () => {
  let service: PruebaEntregaEmbarqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PruebaEntregaEmbarqueService],
    }).compile();

    service = module.get<PruebaEntregaEmbarqueService>(PruebaEntregaEmbarqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
