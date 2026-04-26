import { Router } from "express";
import agent from "../controllers/agent.js";
import validation from "../middleware/validation/agent.js";

const route = Router();

route.post("/query", validation.query, agent.query);

export default route;
