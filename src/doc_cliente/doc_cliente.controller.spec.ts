import { Test, TestingModule } from '@nestjs/testing';
import { DocClienteController } from './doc_cliente.controller';
import { DocClienteService } from './doc_cliente.service';

describe('DocClienteController', () => {
  let controller: DocClienteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocClienteController],
      providers: [DocClienteService],
    }).compile();

    controller = module.get<DocClienteController>(DocClienteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
