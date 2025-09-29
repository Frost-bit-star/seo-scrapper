// lib/db.js
import StackVerifyDB from "@stackverify/db";

const db = new StackVerifyDB();

// Login once at startup with hardcoded credentials
export async function initDB() {
  try {
    await db.login("morganmilston@gmail.com", "@@Morgan.123");
    console.log("✅ Logged in to StackVerify DB");
  } catch (err) {
    console.error("❌ Failed to login to DB:", err.message);
    throw err;
  }
}

// Get user info
export async function getMe() {
  try {
    return await db.me();
  } catch (err) {
    console.error("DB getMe error:", err.message);
    return null;
  }
}

// List tables
export async function listTables() {
  try {
    return await db.listTables();
  } catch (err) {
    console.error("DB listTables error:", err.message);
    return [];
  }
}

// Insert row
export async function insert(table, data) {
  try {
    return await db.insert(table, data);
  } catch (err) {
    console.error(`DB insert error (${table}):`, err.message);
    throw err;
  }
}

// Read rows
export async function read(table, limit = 50, filter = {}) {
  try {
    return await db.read(table, limit, filter);
  } catch (err) {
    console.error(`DB read error (${table}):`, err.message);
    return [];
  }
}

// Update rows
export async function update(table, newData, where) {
  try {
    return await db.update(table, newData, where);
  } catch (err) {
    console.error(`DB update error (${table}):`, err.message);
    throw err;
  }
}

// Delete rows
export async function remove(table, where) {
  try {
    return await db.delete(table, where);
  } catch (err) {
    console.error(`DB delete error (${table}):`, err.message);
    throw err;
  }
}

// Run raw SQL
export async function query(sql) {
  try {
    return await db.query(sql);
  } catch (err) {
    console.error("DB query error:", err.message);
    throw err;
  }
}

// Export db instance for advanced operations
export { db };
