import { IOrm } from "./IOrm";
import { KnexOrm } from "./KnexOrm";

export const OrmFactory = {
  create: (): IOrm => {
    const knexConfigFilePath = KnexOrm.getConfigFile();
    if (knexConfigFilePath) {
      return new KnexOrm();
    }
    throw new Error("Unsupported ORM type");
  },
};
