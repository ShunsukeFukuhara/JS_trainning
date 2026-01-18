import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./index.js";

// Server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDirectory = path.resolve(__dirname, "public");
const port = 8000;

const app = createApp(rootDirectory);

app.listen(port, () => {
  console.log("Listening on port", port);
});
