const fs = require("fs");
const path = require("path");

const envExample = path.resolve(process.cwd(), ".env.example");
const envFile = path.resolve(process.cwd(), ".env");

if (!fs.existsSync(envExample)) {
  console.log(`  ⏭  No .env.example found, skipping`);
  process.exit(0);
}

if (fs.existsSync(envFile)) {
  console.log(`  ✓  .env already exists`);
} else {
  fs.copyFileSync(envExample, envFile);
  console.log(`  ✓  .env created from .env.example`);
}
