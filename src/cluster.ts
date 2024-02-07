import { getOptions } from "./options";
import { logResults } from "./output";

const EXCLUDED_DBS = ["local"];

function getCollectionInfos() {
  // @ts-expect-error
  const databaseInfos = db.adminCommand({ listDatabases: 1 }).databases;
  const collectionInfosByDatabase = databaseInfos
    .filter(({ name }) => !EXCLUDED_DBS.includes(name))
    .map(getCollectionInfosForDatabase);
  return collectionInfosByDatabase.flat();
}

function getCollectionInfosForDatabase(databaseInfo: any) {
  // @ts-expect-error
  const database = db.getSiblingDB(databaseInfo.name);
  const collectionInfosForDatabase = database.getCollectionInfos({
    $or: [{ type: "view" }, { "options.validator": { $exists: 1 } }],
  });
  return collectionInfosForDatabase.map((collectionInfo: any) => ({
    ...collectionInfo,
    db: databaseInfo.name,
  }));
}

const {verbosity} = getOptions();
const collectionInfos = getCollectionInfos();
logResults(collectionInfos, verbosity);
