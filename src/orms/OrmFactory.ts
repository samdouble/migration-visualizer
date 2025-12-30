import { KnexOrm } from "./KnexOrm";

export const OrmFactory = {
  create: () => {
    const knexConfigFilePath = KnexOrm.getConfigFile();
    if (knexConfigFilePath) {
      return new KnexOrm();
    }
    throw new Error("Unsupported ORM type");
  },
};
