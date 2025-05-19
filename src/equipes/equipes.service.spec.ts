import { Test, TestingModule } from '@nestjs/testing';
import { EquipesService } from './equipes.service';

describe('EquipesService', () => {
  let service: EquipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipesService],
    }).compile();

    service = module.get<EquipesService>(EquipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
