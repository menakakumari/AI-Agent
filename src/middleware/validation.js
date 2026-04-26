import basic from "../utils/basic.js";
import { validationResult } from "express-validator";

const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const modifiedErrors = Object.fromEntries(errors.array().map((error) => [error.path, error.msg]));
    return basic.response(res, 400, "Invalid details", null, modifiedErrors);
  }

  next();
};

export default { validationErrors };
