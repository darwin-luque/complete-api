import { Module } from '@nestjs/common';
import { MapperGateway } from './mapper.gateway';

@Module({
  providers: [MapperGateway],
})
export class MapperModule {}
