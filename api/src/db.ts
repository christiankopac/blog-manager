import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

let db: Database;

export async function initializeDatabase() {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            userId INTEGER,
            FOREIGN KEY(userId) REFERENCES users(id)
        );
    `);

    return db;
}

export { db };