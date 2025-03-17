const { execSync } = require("child_process");

try {
  console.log("Setting up Git configuration...");

  // Configure Git
  execSync('git config --global --add safe.directory "$(pwd)"', {
    stdio: "inherit",
  });
  execSync('git config --global user.email "tempo-user@example.com"', {
    stdio: "inherit",
  });
  execSync('git config --global user.name "Tempo User"', { stdio: "inherit" });

  // Initialize Git if not already initialized
  try {
    execSync("git status", { stdio: "pipe" });
    console.log("Git repository already initialized");
  } catch (error) {
    console.log("Initializing Git repository...");
    execSync("git init", { stdio: "inherit" });
  }

  console.log("Git setup completed successfully!");
} catch (error) {
  console.error("Error setting up Git:", error.message);
  process.exit(1);
}
