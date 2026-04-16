const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Use dynamic port (IMPORTANT for Render)
const port = 4545;

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://apartment-management-system-three.vercel.app",
];

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const memberRoutes = require("./src/Routes/membersRoute");
const maintenanceRoutes = require("./src/Routes/maintenanceRoutes");
const complaintRoutes = require("./src/Routes/complaintsRouter");
const communityHallRoutes = require("./src/Routes/communityHallRoutes");
const noticeBoardRouter = require("./src/Routes/noticeBoardRoutes");
const vehicleRouter = require("./src/Routes/vehicleRoutes");
const visitorRoutes = require("./src/Routes/visitorRoutes");
const authRoutes = require("./src/Auth/authRoutes");

app.use("/api/members", memberRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/bookings", communityHallRoutes);
app.use("/api/notices", noticeBoardRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/visitors", visitorRoutes);
app.use("/api/auth", authRoutes);

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check route (VERY USEFUL)
app.get("/getversion", (req, res) => {
  res.status(200).json({
    status: true,
    status_code: 200,
    message: "Backend working fine",
    version: "v1.0.0",
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// CORS error handler (optional but useful)
app.use((err, req, res, next) => {
  if (err.message === "CORS not allowed") {
    return res.status(403).json({ error: "CORS blocked this request" });
  }
  next(err);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
