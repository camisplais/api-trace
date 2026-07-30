import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpTokenService } from './otp_token.service';
import { OtpTokenController } from './otp_token.controller';
import { OtpToken } from './entities/otp_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtpToken])],
  controllers: [OtpTokenController],
  providers: [OtpTokenService],
})
export class OtpTokenModule {}
