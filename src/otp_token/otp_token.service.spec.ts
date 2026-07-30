import { Test, TestingModule } from '@nestjs/testing';
import { OtpTokenService } from './otp_token.service';

describe('OtpTokenService', () => {
  let service: OtpTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpTokenService],
    }).compile();

    service = module.get<OtpTokenService>(OtpTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
