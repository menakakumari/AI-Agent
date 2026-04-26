import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import agent from "./helpers/agent.js";

const { IP, PORT } = process.env;
const server = express();

server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  legacyHeaders: false,
  standardHeaders: false,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);

    res.status(429).json({
      success: false,
      message: `Too many requests. Try again in ${retryAfterSeconds}s. Limit: ${req.rateLimit.limit}, Remaining: ${req.rateLimit.remaining}`,
    });
  },
});

server.use(express.json());

server.get("/", (req, res) => res.send("AI Agent is running..."));
server.use("/api", limiter, routes);

export default async () => {
  await agent.init();
  server.listen(PORT, IP, () => {
    console.log(`Server Listening on ${IP}:${PORT}`);
  });
};
