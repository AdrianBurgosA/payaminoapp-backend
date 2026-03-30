import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmpresaModule } from './empresa/empresa.module';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { UsuarioRolModule } from './usuario_rol/usuario_rol.module';
import { winstonConfig } from './common/log/logger.config';
import { WinstonModule } from 'nest-winston';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ServicioitemModule } from './servicioitem/servicioitem.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { OrdenModule } from './orden/orden.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EmpresaModule,
    UsuarioModule,
    UsuarioRolModule,
    AuthModule,
    ServicioitemModule,
    VehiculoModule,
    OrdenModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
