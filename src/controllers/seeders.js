import path from "path";
import fs from "fs/promises";
import basic from "../utils/basic.js";

const { APP_PATH } = process.env;

const run = async (req, res) => {
  const db = req.conn;
  const trx = await db.startTransaction().execute();

  try {
    const tables = ["customers", "products", "orders", "order_items"];

    for (const table of tables) {
      const file = await fs.readFile(path.resolve(`${APP_PATH}/src/database/seeders/${table}.json`), "utf-8");
      const data = JSON.parse(file);

      await trx.insertInto(table).values(data).execute();
    }

    await trx.commit().execute();
    return basic.response(res, 200, "Seeder run successfully");
  } catch (error) {
    await trx.rollback().execute();
    return basic.response(res, 500, error.message, null, error);
  }
};

export default { run };
