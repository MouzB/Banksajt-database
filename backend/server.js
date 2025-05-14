import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Skapa anslutning till MySQL
const pool = mysql.createPool({
  user: "root",
  password: "root",
  host: "localhost",
  database: "bank",
  port: 3306,
});

// Hjälpfunktion för SQL-frågor
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Generera enkelt sessions-token
function generateToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Skapa ny användare
app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  console.log("createuser");
 /// try {
    const existing = await query("SELECT * FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Användarnamnet finns redan" });
    }
    console.log(existing);

    const result = await query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
    const userId = result.insertId;

    console.log("createduser");

    await query("INSERT INTO accounts (userId, amount) VALUES (?, 0)", [userId]);

    console.log("createdaccount");

    res.json({ message: "Användare skapad" });
  ///} catch (error) {
   // console.error(error);
    //res.status(500).json({ error: "Fel vid skapandet av användare" });
  //}
});

// Logga in användare
app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
    if (users.length === 0) return res.status(401).json({ error: "Fel användarnamn eller lösenord" });

    const user = users[0];
    const token = generateToken();

    await query("INSERT INTO sessions (userId, token) VALUES (?, ?)", [user.id, token]);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Fel vid inloggning" });
  }
});

// Hämta användarens saldo
app.post("/me/accounts", async (req, res) => {
  const { token } = req.body;

  try {
    const session = await query("SELECT * FROM sessions WHERE token = ?", [token]);
    if (session.length === 0) return res.status(403).json({ error: "Ogiltigt token" });

    const account = await query("SELECT * FROM accounts WHERE userId = ?", [session[0].userId]);
    res.json({ amount: account[0].amount });
  } catch (error) {
    res.status(500).json({ error: "Fel vid hämtning av saldo" });
  }
});

// Sätt in pengar
app.post("/me/accounts/transactions", async (req, res) => {
  const { token, amount } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Ogiltigt belopp" });
  }

  try {
    const session = await query("SELECT * FROM sessions WHERE token = ?", [token]);
    if (session.length === 0) return res.status(403).json({ error: "Ogiltigt token" });

    await query("UPDATE accounts SET amount = amount + ? WHERE userId = ?", [amount, session[0].userId]);

    const updated = await query("SELECT amount FROM accounts WHERE userId = ?", [session[0].userId]);
    res.json({ message: "Insättning lyckades", newAmount: updated[0].amount });
  } catch (error) {
    res.status(500).json({ error: "Fel vid insättning" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});


// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});
