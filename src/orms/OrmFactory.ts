import { IOrm } from "./IOrm";
import { KnexOrm } from "./KnexOrm";
import { KyselyOrm } from "./KyselyOrm";
import { DialectType, OrmConfig, OrmType } from "./types";

export type ConnectionOptions = {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  filename?: string;
  useNullAsDefault?: boolean;
};

export type OrmOptions = {
  connection?: ConnectionOptions;
  dialect?: DialectType;
  migrations?: string;
  useNullAsDefault?: boolean;
};

export const OrmFactory = {
  create: async (ormName: string, options: OrmOptions = {}): Promise<IOrm> => {
    switch(ormName) {
      case OrmType.Knex: {
        const orm = new KnexOrm();
        await orm.initialize();
        return orm;
      }
      case OrmType.Kysely: {
        const orm = new KyselyOrm();
        if (!options.dialect) {
          throw new Error('Dialect not provided');
        }
        await orm.initialize({
          client: options.dialect as DialectType,
          connection: options.connection,
          migrations: {
            directory: options.migrations ?? '',
            extension: '.ts',
          },
          useNullAsDefault: options.useNullAsDefault,
        } as OrmConfig);
        return orm;
      }
      default:
        throw new Error(`Unsupported ORM type: ${ormName}`);
    }
  },
};
