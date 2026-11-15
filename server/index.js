const express = require("express");
const cors = require("cors");
const pool = require("./db");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    error: "Too many requests. Please try again later.",
  },
});

app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(helmet());
app.use(limiter);
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};

const pins = [
      {
    id: 1,
    title: "Mountain Adventure",
    image: "https://example.com/mountain.jpg",
    description: "Beautiful mountains and nature.",
    category: "Travel",
  },
  {
    id: 2,
    title: "Gym Motivation",
    image: "https://example.com/gym.jpg",
    description: "Stay consistent and keep training.",
    category: "Fitness",
  },
];


app.get("/", (req, res) => {
    res.send("Pinterest Backend is Running!");
});


app.get("/api/pins", authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pins WHERE user_id = $1 ORDER BY id ASC",
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});
app.post("/api/pins", authenticateToken, async (req, res, next) => {
  try {
    const { title, image, description, category } = req.body;

  if (
  typeof title !== "string" || !title.trim() ||
  typeof image !== "string" || !image.trim() ||
  typeof description !== "string" || !description.trim() ||
  typeof category !== "string" || !category.trim()
) {
  return res.status(400).json({
    error: "All fields are required and must be valid text",
  });
}
 try {
  const imageUrl = new URL(image);

  if (imageUrl.protocol !== "http:" && imageUrl.protocol !== "https:") {
    throw new Error("Invalid protocol");
  }
} catch {
  return res.status(400).json({
    error: "Please provide a valid image URL",
  });
}
if (title.trim().length > 255 || category.trim().length > 100) {
  return res.status(400).json({
    error: "Title must be under 256 characters and category under 101 characters",
  });
}
    const result = await pool.query(
      `INSERT INTO pins (title, image, description, category, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title.trim(), image.trim(), description.trim(), category.trim(), req.user.userId]
    );

    res.status(201).json(result.rows[0]);
  }catch (error) {
  next(error);
}
});app.get("/api/saved-pins", authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT pins.*
FROM pins
INNER JOIN saved_pins
ON pins.id = saved_pins.pin_id
WHERE saved_pins.user_id = $1
ORDER BY pins.id ASC`, [req.user.userId]
    );

    res.json(result.rows);
  }catch (error) {
  next(error);
}
});app.post("/api/saved-pins/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
  return res.status(400).json({
    error: "Invalid pin ID",
  });
}

    const pin = await pool.query(
      "SELECT * FROM pins WHERE id = $1",
      [id]
    );

    if (pin.rows.length === 0) {
      return res.status(404).json({ error: "Pin not found" });
    }

    await pool.query(
  `INSERT INTO saved_pins (pin_id, user_id)
   VALUES ($1, $2)
   ON CONFLICT (user_id, pin_id) DO NOTHING`,
  [id, req.user.userId]
);

    res.status(201).json({
      message: "Pin saved successfully",
      savedPin: pin.rows[0],
    });
  }catch (error) {
  next(error);
}
});
app.delete("/api/saved-pins/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
  return res.status(400).json({
    error: "Invalid pin ID",
  });
}

    const result = await pool.query(
      "DELETE FROM saved_pins WHERE pin_id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Saved pin not found" });
    }

    res.json({ message: "Pin unsaved successfully" });
  }catch (error) {
  next(error);
}


});


app.put("/api/pins/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
  return res.status(400).json({
    error: "Invalid pin ID",
  });
}
    const { title, image, description, category } = req.body;
    if (
  typeof title !== "string" || !title.trim() ||
  typeof image !== "string" || !image.trim() ||
  typeof description !== "string" || !description.trim() ||
  typeof category !== "string" || !category.trim()
) {
  return res.status(400).json({
    error: "All fields are required and must be valid text",
  });
}
try {
  const imageUrl = new URL(image);

  if (imageUrl.protocol !== "http:" && imageUrl.protocol !== "https:") {
    throw new Error("Invalid protocol");
  }
} catch {
  return res.status(400).json({
    error: "Please provide a valid image URL",
  });
}
if (title.trim().length > 255 || category.trim().length > 100) {
  return res.status(400).json({
    error: "Title must be under 256 characters and category under 101 characters",
  });
}

    const result = await pool.query(
      `UPDATE pins
       SET title = $1,
           image = $2,
           description = $3,
           category = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
     [title.trim(), image.trim(), description.trim(), category.trim(), id,  req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pin not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
  next(error);
}
});

app.delete("/api/pins/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
  return res.status(400).json({
    error: "Invalid pin ID",
  });
}

    const result = await pool.query(
      "DELETE FROM pins WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pin not found" });
    }

    res.json({ message: "Pin deleted successfully", deletedPin: result.rows[0] });
  }catch (error) {
  next(error);
}
});
app.post("/api/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Please provide username, email and password",
      });
    }

    if (username.trim().length > 100 || email.trim().length > 255) {
      return res.status(400).json({
        error: "Username or email is too long",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save the new user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username.trim(), email.trim().toLowerCase(), passwordHash]
    );

    res.status(201).json({
      message: "Account created successfully",
      user: result.rows[0],
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email is already registered",
      });
    }

    next(error);
  }
});
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Please provide email and password",
      });
    }

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    next(error);
  }
});
app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found",
  });
});
app.use((err, req, res, next) => {

  if (res.headersSent) {
  return next(err);
}
  console.error(err);

 const statusCode = err.status || 500;

res.status(statusCode).json({
  error: statusCode === 500
    ? "Something went wrong on the server"
    : err.message,
});
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});