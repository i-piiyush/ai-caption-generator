require("dotenv").config({ path: __dirname + "/.env" });
const app = require("./src/app");
const connectToDB = require("./src/db/db");

connectToDB();

app.listen(3000, () => {
  console.log("server running on port 3000");
});
