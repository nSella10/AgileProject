import fs from "fs";
import path from "path";

// הגדר את התיקייה שברצונך לסרוק
const routesDir = path.join(process.cwd(), "backend", "routes");

// ביטויים שיחשפו תבניות לא חוקיות
const badRoutePatterns = [
  /router\.(get|post|put|delete|patch)\(["']\/:\W/, // למשל /:/
  /router\.(get|post|put|delete|patch)\(["']\/:$/m, // /: בסוף השורה
  /router\.(get|post|put|delete|patch)\(["']\/:[^a-zA-Z0-9]/, // /:!
];

const checkFileForBadRoutes = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8").split("\n");

  content.forEach((line, index) => {
    badRoutePatterns.forEach((pattern) => {
      if (pattern.test(line)) {
        console.log(
          `⚠️  Suspicious route in ${filePath} at line ${index + 1}:`
        );
        console.log(`    ${line.trim()}`);
      }
    });
  });
};

fs.readdir(routesDir, (err, files) => {
  if (err) {
    console.error("❌ Failed to read routes directory:", err);
    return;
  }

  files
    .filter((f) => f.endsWith(".js"))
    .forEach((file) => {
      const fullPath = path.join(routesDir, file);
      checkFileForBadRoutes(fullPath);
    });
});
