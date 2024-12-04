import express from "express";
import cors from "cors";
import profiles from "./routes/profile.js";
import messages from "./routes/message.js";

const PORT = 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/profile", profiles);
app.use("/message", messages);

// start the Express server .
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
