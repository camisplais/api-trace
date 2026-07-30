import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriaLogService } from './auditoria_log.service';

describe('AuditoriaLogService', () => {
  let service: AuditoriaLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditoriaLogService],
    }).compile();

    service = module.get<AuditoriaLogService>(AuditoriaLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
