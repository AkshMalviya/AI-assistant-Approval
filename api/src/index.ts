import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import assistantRoutes from "./routes/assistant.routes";
import { errorHandler } from "./middleware/error-handler";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", assistantRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
