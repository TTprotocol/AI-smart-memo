import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// DB 연결 테스트용 풀 생성
const pool = mysql.createPool({
	host: DB_HOST,
	port: DB_PORT,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

// 헬스 체크
app.get("/health", (req, res) => {
	res.json({ ok: true });
});

// DB 연결 확인(진짜로 쿼리 1번 날려봄)
app.get("/db/ping", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT 1 AS ping");
		res.json({ ok: true, rows });
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: "DB connection failed",
			error: String(error),
		});
	}
});

app.listen(8000, () => {
	console.log("Backend listening on http://localhost:8000");
});
