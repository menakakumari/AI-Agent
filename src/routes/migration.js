import { Router } from "express";
import migration from "../controllers/migration.js";

const route = Router();

route.get("/run", migration.run);

export default route;
