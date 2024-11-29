module.exports = (pool) => {
  const express = require("express");
  const router = express.Router();

  // User Registration
  router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Insert new user
      await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, password]
      );

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // User Login
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check user credentials
      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1 AND password = $2",
        [username, password]
      );

      if (result.rows.length > 0) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/", async (req, res) => {
    res.json({ message: "API Endpoint" });
  });

  return router;
};
