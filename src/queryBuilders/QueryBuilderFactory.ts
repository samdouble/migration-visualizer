import { IQueryBuilder } from "./IQueryBuilder";
import { KnexQueryBuilder } from "./KnexQueryBuilder";
import { KyselyQueryBuilder } from "./KyselyQueryBuilder";
import { DialectType, QueryBuilderConfig, QueryBuilderType } from "./types";

export type ConnectionOptions = {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  filename?: string;
  useNullAsDefault?: boolean;
};

export type QueryBuilderOptions = {
  connection?: ConnectionOptions;
  dialect?: DialectType;
  migrations?: string;
  useNullAsDefault?: boolean;
};

export const QueryBuilderFactory = {
  create: async (queryBuilderName: string, options: QueryBuilderOptions = {}): Promise<IQueryBuilder> => {
    switch(queryBuilderName) {
      case QueryBuilderType.Knex: {
        const queryBuilder = new KnexQueryBuilder();
        await queryBuilder.initialize();
        return queryBuilder;
      }
      case QueryBuilderType.Kysely: {
        const queryBuilder = new KyselyQueryBuilder();
        if (!options.dialect) {
          throw new Error('Dialect not provided');
        }
        await queryBuilder.initialize({
          client: options.dialect as DialectType,
          connection: options.connection,
          migrations: {
            directory: options.migrations ?? '',
            extension: '.ts',
          },
          useNullAsDefault: options.useNullAsDefault,
        } as QueryBuilderConfig);
        return queryBuilder;
      }
      default:
        throw new Error(`Unsupported Query Builder type: ${queryBuilderName}`);
    }
  },
};
