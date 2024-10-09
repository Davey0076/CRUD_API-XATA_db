import { buildClient } from "@xata.io/client";
import type { BaseClientOptions, SchemaInference, XataRecord } from "@xata.io/client";

// Define your schema for the "users" table
const tables = [
  {
    name: "users",
    columns: [
      {
        name: "displayName",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "userName",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;
export type Users = InferredTypes["users"];
export type UsersRecord = Users & XataRecord;

export type DatabaseSchema = {
  users: UsersRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://David-Okoth-s-workspace-tc9h0v.us-east-1.xata.sh/db/Simple_CRUD_Database",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  // Using environment variables for Xata API key and branch
  instance = new XataClient({
    apiKey: process.env.XATA_API_KEY,  // Ensure this is set in your .env file
    branch: process.env.XATA_BRANCH,   // Ensure this is set in your .env file
  });
  return instance;
};
