import { KnexOrm } from "./KnexOrm";
import { OrmFactory } from "./OrmFactory";

describe('OrmFactory', () => {
  it('should create a KnexOrm when knexfile exists', () => {
    jest.spyOn(KnexOrm, 'getConfigFile').mockReturnValue('/knexfile.ts');

    const orm = OrmFactory.create();
    expect(orm).toBeInstanceOf(KnexOrm);

    jest.restoreAllMocks();
  });

  it('should throw an error when no config file is found', () => {
    jest.spyOn(KnexOrm, 'getConfigFile').mockReturnValue(null);

    expect(() => OrmFactory.create()).toThrow('Unsupported ORM type');

    jest.restoreAllMocks();
  });
});
