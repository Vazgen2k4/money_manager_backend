import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
  static forRoot() {
    return {
      module: PrismaModule,
      exports: [PrismaService],
      global: true,
    };
  }
}
