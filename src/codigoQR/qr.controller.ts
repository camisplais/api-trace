import { UseGuards,Controller, Get, Post,Body,Req, Res, UnauthorizedException,Param } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { QRService } from './qr.service';
import { SessionGuard } from '../auth/session.guard';
import { CurrentUser } from '../auth/current-user.decorator';


@Controller('qr')
export class QRController 
{
    constructor(
        private readonly qrService: QRService,
        private readonly authService: AuthService,
    ) {}

    @Get('generar-codigo/:viajeId')
    @UseGuards(SessionGuard)
    async genearCodigo(@Param('viajeId') viajeId: number) {
    return this.qrService.generarCodigo(viajeId);
    }

    @Get('ultimo-codigo')
    @UseGuards(SessionGuard)
    async getUltimoCodigo(@CurrentUser() user: {id: string}) {
        return this.qrService.getUltimoCodigo(user.id);
    }

    @Post('escanear-codigo')
    @UseGuards(SessionGuard)
    async escanearCodigo(
    @CurrentUser() user: {id: string},
    @Body() body: { qr: string;}
    ) {
    return this.qrService.escanearCodigo(
        user.id,
        body.qr,
    );
    }
}