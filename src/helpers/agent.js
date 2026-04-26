import { LlmAgent, Gemini, InMemoryRunner } from "@google/adk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const cache = {};
const { GOOGLE_MODEL, GOOGLE_API_KEY } = process.env;

const Agent = async (name) => {
  if (cache[name]) return cache[name];

  const { default: behaviour } = await import(`../agents/${name}.js`);

  const model = new Gemini({
    model: GOOGLE_MODEL,
    apiKey: GOOGLE_API_KEY,
  });

  const agent = new LlmAgent({
    model,
    name: behaviour.name,
    description: behaviour.description,
    instruction: behaviour.instruction,
  });

  cache[name] = agent;

  return agent;
};

const init = async () => {
  await Agent("db-query-expert");
  await Agent("db-response-expert");
};

const User = async (agent, query) => {
  const runner = new InMemoryRunner({ agent });
  const response = runner.runEphemeral({
    userId: "user-123",
    newMessage: {
      role: "user",
      parts: [{ text: query }],
    },
    runConfig: {
      streamingMode: "none",
    },
  });

  let result = "";
  for await (const event of response) {
    for (const part of event?.content?.parts ?? []) {
      if (part.text && part.text.length) result += part.text;
    }
  }

  return result.trim();
};

const GenerateText = async (prompt) => {
  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: GOOGLE_MODEL });
  const result = await model.generateContent(prompt);

  return result.response.text();
};

export default { Agent, User, GenerateText, init };
