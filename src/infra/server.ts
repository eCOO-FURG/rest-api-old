import { app } from "./app";
import { env } from "./env";

app
  .listen({
    host: "0.0.0.0",
    port: env.SERVER_PORT,
  })
  .then(() => {
    app.swagger();
    console.log("🚀 HTTP Server Running!");
  });
