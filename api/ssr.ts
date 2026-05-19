import server from "../dist/server/server.js";

export const config = {
  runtime: "edge",
};

const edgeContext = {
  waitUntil(_promise: Promise<unknown>) {},
};

export default function handler(request: Request) {
  return server.fetch(request, {}, edgeContext);
}
