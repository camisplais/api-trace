import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtpTokenService } from './otp_token.service';
import { CreateOtpTokenDto } from './dto/create-otp_token.dto';
import { UpdateOtpTokenDto } from './dto/update-otp_token.dto';

@Controller('otp-token')
export class OtpTokenController {
  constructor(private readonly otpTokenService: OtpTokenService) {}

  @Post()
  create(@Body() createOtpTokenDto: CreateOtpTokenDto) {
    return this.otpTokenService.create(createOtpTokenDto);
  }

  @Get()
  findAll() {
    return this.otpTokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otpTokenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOtpTokenDto: UpdateOtpTokenDto) {
    return this.otpTokenService.update(+id, updateOtpTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otpTokenService.remove(+id);
  }
}
