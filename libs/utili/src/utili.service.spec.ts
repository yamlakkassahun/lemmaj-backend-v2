import { Test, TestingModule } from '@nestjs/testing';
import { UtiliService } from './utili.service';

describe('UtiliService', () => {
  let service: UtiliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtiliService],
    }).compile();

    service = module.get<UtiliService>(UtiliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
