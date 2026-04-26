import connection from "../database/connection.js";
import { Router } from "express";

import migration from "./migration.js";
import seeders from "./seeders.js";
import agent from "./agent.js";

const route = Router();

route.use((req, res, next) => {
  req.conn = connection;
  next();
});

route.use("/migration", migration);
route.use("/seeders", seeders);
route.use("/agent", agent);

export default route;
