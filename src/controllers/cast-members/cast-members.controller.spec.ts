import {Test, TestingModule} from '@nestjs/testing';
import {CastMembersController} from './cast-members.controller';

describe('CastMembers Controller', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CastMembersController],
    }).compile();

    controller = module.get<CastMembersController>(CastMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
