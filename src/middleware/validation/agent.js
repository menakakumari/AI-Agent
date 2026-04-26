import { body } from "express-validator";
import validation from "../validation.js";

const query = [
  //
  body("query").notEmpty().withMessage("Query is required").bail().isString().withMessage("Query must be a string").bail().trim().isLength({ min: 10, max: 200 }).withMessage("Please provide a valid query (min 10 - max 200 characters)"),
  validation.validationErrors,
];

export default { query };
