import { UseGuards,Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViajeEmbarqueService } from './viaje_embarque.service';
import { CreateViajeEmbarqueDto } from './dto/create-viaje_embarque.dto';
import { UpdateViajeEmbarqueDto } from './dto/update-viaje_embarque.dto';
import { AuthService } from 'src/auth/auth.service';
import { SessionGuard } from 'src/auth/session.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('viaje-embarque')
export class ViajeEmbarqueController {
  constructor(private readonly viajeEmbarqueService: ViajeEmbarqueService) {}

  @Post()
  @UseGuards(SessionGuard)
  create(@Body() createViajeEmbarqueDto: CreateViajeEmbarqueDto) {
    return this.viajeEmbarqueService.create(createViajeEmbarqueDto);
  }

  @Get()
  @UseGuards(SessionGuard)
  findAll() {
    return this.viajeEmbarqueService.findAll();
  }

  @Get(':id')
  @UseGuards(SessionGuard)
  findOne(@Param('id') id: string) {
    return this.viajeEmbarqueService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  update(@Param('id') id: string, @Body() updateViajeEmbarqueDto: UpdateViajeEmbarqueDto) {
    return this.viajeEmbarqueService.update(+id, updateViajeEmbarqueDto);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param('id') id: string) {
    return this.viajeEmbarqueService.remove(+id);
  }
}
