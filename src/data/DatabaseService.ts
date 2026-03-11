import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { app } from 'electron';
import { Skill, World, CommandEvent } from '../common/types';

export class DatabaseService {
  private db: Database | null = null;

  async initialize(dbPathOverride?: string) {
    const dbPath = dbPathOverride || (app ? path.join(app.getPath('userData'), 'engine_v52.sqlite') : './engine_v52.sqlite');
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await this.createTables();
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        xp REAL,
        mastery TEXT,
        world TEXT,
        lastUsed INTEGER,
        tensorPattern TEXT
      );

      CREATE TABLE IF NOT EXISTS worlds (
        id TEXT PRIMARY KEY,
        data TEXT
      );

      CREATE TABLE IF NOT EXISTS session_history (
        id TEXT PRIMARY KEY,
        commandLine TEXT,
        argv TEXT,
        cwd TEXT,
        stdout TEXT,
        stderr TEXT,
        exitCode INTEGER,
        startedAt INTEGER,
        finishedAt INTEGER,
        duration REAL
      );

      CREATE TABLE IF NOT EXISTS npc_personas (
        id TEXT PRIMARY KEY,
        role TEXT,
        name TEXT,
        theme TEXT,
        scenarios TEXT
      );
    `);
  }

  async saveSkill(skill: Skill) {
    if (!this.db) return;
    await this.db.run(
      `INSERT OR REPLACE INTO skills (id, name, description, xp, mastery, world, lastUsed, tensorPattern)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [skill.id, skill.name, skill.description, skill.xp, skill.mastery, skill.world, skill.lastUsed, skill.tensorPattern]
    );
  }

  async getSkills(): Promise<Skill[]> {
    if (!this.db) return [];
    return this.db.all('SELECT * FROM skills');
  }

  async saveWorld(world: World) {
    if (!this.db) return;
    await this.db.run(
      'INSERT OR REPLACE INTO worlds (id, data) VALUES (?, ?)',
      [world.id, JSON.stringify(world)]
    );
  }

  async getWorld(id: string): Promise<World | null> {
    if (!this.db) return null;
    const row = await this.db.get('SELECT data FROM worlds WHERE id = ?', [id]);
    return row ? JSON.parse(row.data) : null;
  }

  async logCommand(event: CommandEvent) {
    if (!this.db) return;
    await this.db.run(
      `INSERT INTO session_history (id, commandLine, argv, cwd, stdout, stderr, exitCode, startedAt, finishedAt, duration)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [event.id, event.commandLine, JSON.stringify(event.argv), event.cwd, event.stdout, event.stderr, event.exitCode, event.startedAt, event.finishedAt, event.duration]
    );
  }

  async getRecentHistory(limit: number = 10): Promise<CommandEvent[]> {
    if (!this.db) return [];
    const rows = await this.db.all('SELECT * FROM session_history ORDER BY startedAt DESC LIMIT ?', [limit]);
    return rows.map(r => ({
        ...r,
        argv: JSON.parse(r.argv)
    }));
  }
}
