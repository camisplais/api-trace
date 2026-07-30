import { Injectable } from '@nestjs/common';
import { CreateOtpTokenDto } from './dto/create-otp_token.dto';
import { UpdateOtpTokenDto } from './dto/update-otp_token.dto';

@Injectable()
export class OtpTokenService {
  create(createOtpTokenDto: CreateOtpTokenDto) {
    return 'This action adds a new otpToken';
  }

  findAll() {
    return `This action returns all otpToken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otpToken`;
  }

  update(id: number, updateOtpTokenDto: UpdateOtpTokenDto) {
    return `This action updates a #${id} otpToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} otpToken`;
  }
}
