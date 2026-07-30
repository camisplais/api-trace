import { Test, TestingModule } from '@nestjs/testing';
import { EmbarquesController } from './embarques.controller';
import { EmbarquesService } from './embarques.service';

describe('EmbarquesController', () => {
  let controller: EmbarquesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmbarquesController],
      providers: [EmbarquesService],
    }).compile();

    controller = module.get<EmbarquesController>(EmbarquesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
