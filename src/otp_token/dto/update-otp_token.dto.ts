import { PartialType } from '@nestjs/mapped-types';
import { CreateOtpTokenDto } from './create-otp_token.dto';

export class UpdateOtpTokenDto extends PartialType(CreateOtpTokenDto) {}
