import { execSync } from "node:child_process";
import path from "node:path";

try {
  console.log("Current working dir:", process.cwd());
} catch {
  const fixed = path.resolve(".");
  process.chdir(fixed);
  console.log("Manually reset cwd:", fixed);
}
execSync("npm run dev", { stdio: "inherit", cwd: "./web" });
