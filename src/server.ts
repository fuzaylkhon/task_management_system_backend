import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT || 5002;

// Connect to database
connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
