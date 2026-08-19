import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { ClientesModule } from './clientes/clientes.module';
import { DocumentosModule } from './documentos/documentos.module';
import { TransportesModule } from './transportes/transportes.module';
import { OtpTokenModule } from './otp_token/otp_token.module';
import { AuditoriaLogModule } from './auditoria_log/auditoria_log.module';
import { DocClienteModule } from './doc_cliente/doc_cliente.module';
import { EmbarquesModule } from './embarques/embarques.module';
import { PruebaEntregaEmbarqueModule } from './prueba_entrega_embarque/prueba_entrega_embarque.module';
import { ViajesModule } from './viajes/viajes.module';
import { SeguimientoViajeModule } from './seguimiento_viaje/seguimiento_viaje.module';
import { ViajeEmbarqueModule } from './viaje_embarque/viaje_embarque.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { AuthModule } from './auth/auth.module';
import { QRModule } from './codigoQR/qr.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    RolesModule,
    QRModule,
    UsuariosModule,
    EmpleadosModule,
    ClientesModule,
    DocumentosModule,
    TransportesModule,
    OtpTokenModule,
    AuditoriaLogModule,
    DocClienteModule,
    EmbarquesModule,
    PruebaEntregaEmbarqueModule,
    ViajesModule,
    SeguimientoViajeModule,
    ViajeEmbarqueModule,
    SolicitudesModule,
    NotificacionesModule,
    SolicitudesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
