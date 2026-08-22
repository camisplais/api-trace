import { UseGuards,Controller, Get, Post,Body,Req, Res, UnauthorizedException,Param } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { QRService } from './qr.service';
import { SessionGuard } from '../auth/session.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenAuthGuard } from 'src/auth/token.guard';

@Controller('qr')
export class QRController 
{
    constructor(
        private readonly qrService: QRService,
        private readonly authService: AuthService,
    ) {}

    @Get('generar-codigo/:viajeId')
    @UseGuards(SessionGuard)
    async generarCodigo(@Param('viajeId') viajeId: number) {
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

    //endpoints para ios
    @Get('generar-codigo-app/:viajeId')
    @UseGuards(TokenAuthGuard)
    async generarCodigoApp(@Param('viajeId') viajeId: number) {
    return this.qrService.generarCodigo(viajeId);
    }

    @Get('ultimo-codigo-app')
    @UseGuards(TokenAuthGuard)
    async getUltimoCodigoApp(@CurrentUser() user: {id: string}) {
        return this.qrService.getUltimoCodigo(user.id);
    }

    @Post('escanear-codigo-app')
    @UseGuards(TokenAuthGuard)
    async escanearCodigoApp(
    @CurrentUser() user: {id: string},
    @Body() body: { qr: string;}
    ) {
    return this.qrService.escanearCodigo(
        user.id,
        body.qr,
    );
    }
}