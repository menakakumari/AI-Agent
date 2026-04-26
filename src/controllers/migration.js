import basic from "../utils/basic.js";
import migration from "../database/migration.js";

const run = async (req, res) => {
  const db = req.conn;

  try {
    await migration.dropAll(db);
    await migration.customers(db);
    await migration.products(db);
    await migration.orders(db);
    await migration.order_items(db);

    return basic.response(res, 200, "Migration run successfully");
  } catch (error) {
    return basic.response(res, 500, error.message, null, error);
  }
};

export default { run };
