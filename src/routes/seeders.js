import { Router } from "express";
import seeders from "../controllers/seeders.js";

const route = Router();

route.get("/run", seeders.run);

export default route;
