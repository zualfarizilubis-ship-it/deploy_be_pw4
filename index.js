import express from "express";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000;

app.use(express.json());

// 1. GET ALL --> http://localhost:3000/api/todos
app.get("/api/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.todo_items");

    res.status(200).json({
      message: "Data to-do list berhasil diambil.",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Data to-do list gagal diambil.",
      errorMessage: error.message,
    });
  }
});

// 2. ADD TODO --> http://localhost:3000/api/todos
app.post("/api/todos", async (req, res) => {
  const { title, description, priority, deadline, status } = req.body;

  try {
    // parameterized query
    const result = await pool.query(
      "INSERT INTO public.todo_items (title, description, priority, deadline, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, priority, deadline, status],
    );

    res.status(200).json({
      message: "Todo baru berhasil ditambahkan.",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Data gagal ditambahkan.",
      errorMessage: error.message,
    });
  }
});

// 3. GET BY ID --> http://localhost:3000/api/todos/:id
app.get("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM public.todo_items WHERE id = $1",
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        message: `Todo dengan id ${id} tidak ditemukan.`,
      });
    }

    res.status(200).json({
      message: `Todo dengan id ${id} berhasil diambil.`,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: `Todo dengan id ${id} gagal diambil.`,
      errorMessage: error.message,
    });
  }
});

// 4. UPDATE BY ID --> http://localhost:3000/api/todos/:id

// 5. DELETE BY ID --> http://localhost:3000/api/todos/:id

// app.listen(PORT, () =>
//   console.log(
//     new Date().toLocaleTimeString() + `: Server berjalan di PORT ${PORT}...`,
//   ),
// );

export default app;