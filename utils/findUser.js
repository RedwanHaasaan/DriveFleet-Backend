const { ObjectId } = require("mongodb");

function normalizeUser(user) {
  if (!user) return null;

  const id =
    user.id ??
    (user._id instanceof ObjectId ? user._id.toString() : String(user._id));

  return {
    ...user,
    id,
    email: user.email,
    name: user.name,
  };
}

async function findUserById(db, userId) {
  if (!userId) return null;

  const collection = db.collection("user");

  // better-auth mongo adapter stores user primary key as _id
  let user = await collection.findOne({ _id: userId });
  if (user) return normalizeUser(user);

  if (ObjectId.isValid(userId)) {
    user = await collection.findOne({ _id: new ObjectId(userId) });
    if (user) return normalizeUser(user);
  }

  // fallback if a document has a separate id field
  user = await collection.findOne({ id: userId });
  if (user) return normalizeUser(user);

  return null;
}

async function findAccountByUserId(db, userId) {
  if (!userId) return null;

  const collection = db.collection("account");
  const queries = [{ userId }];

  if (ObjectId.isValid(userId)) {
    queries.push({ userId: new ObjectId(userId) });
  }

  for (const query of queries) {
    const account = await collection.findOne({
      ...query,
      providerId: "credential",
    });
    if (account) return account;
  }

  return collection.findOne({
    userId,
    providerId: "credential",
  });
}

module.exports = {
  findUserById,
  findAccountByUserId,
  normalizeUser,
};
