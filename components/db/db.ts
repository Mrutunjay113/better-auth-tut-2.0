import { MongoClient } from "mongodb";

function getConnectionUri(): string {
  const raw = process.env.MONGODB_URI;
  if (raw == null || raw === "") {
    throw new Error("MONGODB_URI is not set");
  }
  return raw;
}

const connectionUri = getConnectionUri();

/** Survives Next.js dev HMR so we do not open a new pool on every reload. */
const mongoGlobal = globalThis as typeof globalThis & {
  __mongoClient?: MongoClient;
};

function createClient(): MongoClient {
  return new MongoClient(connectionUri, {
    maxPoolSize: 10,
  });
}

function getClient(): MongoClient {
  if (mongoGlobal.__mongoClient == null) {
    mongoGlobal.__mongoClient = createClient();
  }
  return mongoGlobal.__mongoClient;
}

export const client = getClient();
export const db = client.db();
