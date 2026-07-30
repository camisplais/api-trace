import { Test, TestingModule } from '@nestjs/testing';
import { DocClienteService } from './doc_cliente.service';

describe('DocClienteService', () => {
  let service: DocClienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocClienteService],
    }).compile();

    service = module.get<DocClienteService>(DocClienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
