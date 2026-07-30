import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriaLogController } from './auditoria_log.controller';
import { AuditoriaLogService } from './auditoria_log.service';

describe('AuditoriaLogController', () => {
  let controller: AuditoriaLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriaLogController],
      providers: [AuditoriaLogService],
    }).compile();

    controller = module.get<AuditoriaLogController>(AuditoriaLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
