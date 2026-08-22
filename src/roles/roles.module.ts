import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  // AuthModule va porque el controller usa SessionGuard, que inyecta AuthService.
  imports: [TypeOrmModule.forFeature([Role]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
