const Database = require("better-sqlite3");

const db = new Database("users.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT,
        dob TEXT,
        email TEXT,
        username TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL
    )
`);

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'applied',
        dateApplied TEXT,
        jobUrl TEXT,
        notes TEXT,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
`);

// Add the picture columns if they don't exist yet (the table already exists, so we alter it)
const userColumns = db.prepare("PRAGMA table_info(users)").all().map(function (c) {
    return c.name;
});
if (!userColumns.includes("avatar")) {
    db.exec("ALTER TABLE users ADD COLUMN avatar BLOB");
}
if (!userColumns.includes("avatarType")) {
    db.exec("ALTER TABLE users ADD COLUMN avatarType TEXT");
}

module.exports = db;