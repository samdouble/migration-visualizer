import { KnexOrm } from "./KnexOrm";
import { KyselyOrm } from "./KyselyOrm";
import { OrmFactory } from "./OrmFactory";
import { DialectType } from "./types";

describe('OrmFactory', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a KnexOrm when knexfile exists', async () => {
    jest.spyOn(KnexOrm, 'getConfigFile').mockReturnValue('/knexfile.ts');
    jest.spyOn(KnexOrm.prototype, 'initialize').mockResolvedValue(undefined);

    const orm = await OrmFactory.create('knex');
    expect(orm).toBeInstanceOf(KnexOrm);
  });

  it('should create a KyselyOrm when no knexfile exists', async () => {
    jest.spyOn(KnexOrm, 'getConfigFile').mockReturnValue(null);

    const orm = await OrmFactory.create('kysely', {
      dialect: DialectType.BetterSqlite3,
      connection: {
        filename: ':memory:',
      },
    });
    expect(orm).toBeInstanceOf(KyselyOrm);
  });
});
