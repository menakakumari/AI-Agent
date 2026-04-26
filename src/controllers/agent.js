import { sql } from "kysely";
import basic from "../utils/basic.js";
import agent from "../helpers/agent.js";

const query = async (req, res) => {
  const db = req.conn;

  try {
    const { query } = req.body;

    const dbAgent = await agent.Agent("db-query-expert");
    const dbQuery = await agent.User(dbAgent, query);

    // Extract SQL from markdown block if present, and trim
    const cleanQuery = dbQuery
      .replace(/```(?:sql)?/gi, "")
      .replace(/```/g, "")
      .replaceAll("\n", " ")
      .trim();

    // SQL Safety Check: Allow only SELECT and forbid multiple statements via semicolon
    if (!cleanQuery.toLowerCase().startsWith("select") || cleanQuery.includes(";")) {
      return basic.response(res, 400, "Invalid request. I can only answer questions that require retrieving data.");
    }

    const dbResult = await sql.raw(cleanQuery).execute(db);
    const jsonResult = JSON.stringify(dbResult.rows, null, 2);

    const resAgent = await agent.Agent("db-response-expert");
    const resUser = await agent.User(
      resAgent,
      `
      User Question:
      ${query}

      Database Result:
      ${jsonResult}
    `.trim(),
    );

    return basic.response(res, 200, "Query result", resUser);
  } catch (error) {
    return basic.response(res, 500, error.message, null, error);
  }
};

export default { query };
