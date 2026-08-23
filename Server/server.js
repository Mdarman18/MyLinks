import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/connections/connect.js";
import { route } from "./src/route/route.js";
import cors from "cors";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ======------ connect to db ------=========
connectDb();
app.use(cors({ origin: "http://localhost:5173" }));
// ====------Central middleware --===========
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
// =======------    Slove cros issue -----------====================

// ======----- Main Route ----===========
app.use("/api/user", route);
app.get("/", (req, res) => {
  res.send("Server is running!");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
