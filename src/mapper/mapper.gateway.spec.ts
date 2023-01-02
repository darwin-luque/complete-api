import { Test, TestingModule } from '@nestjs/testing';
import { MapperGateway } from './mapper.gateway';

describe('MapperGateway', () => {
  let gateway: MapperGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapperGateway],
    }).compile();

    gateway = module.get<MapperGateway>(MapperGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
