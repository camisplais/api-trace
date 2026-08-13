import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmbarquesService } from './embarques.service';

@Controller('embarques')
export class EmbarquesController {
  constructor(private readonly embarquesService: EmbarquesService) {}

  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  async importarArchivo(@UploadedFile() file: Express.Multer.File) {
    return this.embarquesService.importarArchivo(file);
  }
}