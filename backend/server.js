import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("StudyTwin API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "StudyTwin AI" });
});

app.get("/api/hello/:name", (req, res) => {
  res.json({ message: `Hello, ${req.params.name}!` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});