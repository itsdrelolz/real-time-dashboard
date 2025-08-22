import app from "./api/app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}!`);
});
