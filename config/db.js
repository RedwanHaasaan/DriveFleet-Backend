const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  try {
    await client.connect();

    db = client.db(process.env.DB_NAME);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
  }
}

function getDB() {
  return db;
}

module.exports = {
  connectDB,
  getDB,
};