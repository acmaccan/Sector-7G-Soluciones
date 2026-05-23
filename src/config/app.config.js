import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const API_NAME = "Talento Evolutivo S.A. API";
export const ROOT_DIR = path.resolve(__dirname, "..");
export const DATA_DIR = path.join(ROOT_DIR, "db", "data");
export const NOVEDAD_ESTADOS = ["pendiente", "procesada", "rechazada"];

export const connectDB = async () => {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4,
  });
  console.log("MongoDB connected.");
};
