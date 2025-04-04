const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();


// Middleware kurulumları
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json());

// CORS için header'ları ekle
app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Content-Disposition, Accept"
  );
  next();
});

// Routes
const testRoutes = require("./routes/testRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const questionRoutes = require("./routes/questionRoutes");
const groupRoutes = require("./routes/groupRoutes");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const motivationRoutes = require("./routes/motivationRoutes");

// Route montajı
app.use("/tests", testRoutes);
app.use("/candidates", candidateRoutes);
app.use("/questions", questionRoutes);
app.use("/group", groupRoutes);
app.use("/student", studentRoutes);
app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.use("/motivation", motivationRoutes);

// Hata yönetimi middleware'i
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Sunucu hatası oluştu",
    message: err.message,
  });
});

const PORT = process.env.PORT || 3380;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
