import { KnexQueryBuilder } from "./KnexQueryBuilder";
import { KyselyQueryBuilder } from "./KyselyQueryBuilder";
import { QueryBuilderFactory } from "./QueryBuilderFactory";
import { DialectType } from "./types";

describe('QueryBuilderFactory', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a KnexQueryBuilder when knexfile exists', async () => {
    jest.spyOn(KnexQueryBuilder, 'getConfigFile').mockReturnValue('/knexfile.ts');
    jest.spyOn(KnexQueryBuilder.prototype, 'initialize').mockResolvedValue(undefined);

    const queryBuilder = await QueryBuilderFactory.create('knex');
    expect(queryBuilder).toBeInstanceOf(KnexQueryBuilder);
  });

  it('should create a KyselyQueryBuilder when no knexfile exists', async () => {
    jest.spyOn(KnexQueryBuilder, 'getConfigFile').mockReturnValue(null);

    const queryBuilder = await QueryBuilderFactory.create('kysely', {
      dialect: DialectType.BetterSqlite3,
      connection: {
        filename: ':memory:',
      },
    });
    expect(queryBuilder).toBeInstanceOf(KyselyQueryBuilder);
  });
});
