import crypto from 'crypto';
import { pgPool } from '../config/db.js';

const now = () => new Date();
const newId = () => crypto.randomUUID();

const tableMap = {
  users: 'users',
  sessions: 'sessions',
  verificationCodes: 'verification_codes',
  tokenBlacklist: 'token_blacklist',
  portfolio: 'portfolio_items',
  bookings: 'bookings',
  messages: 'messages',
};

const fieldMap = {
  _id: 'id',
  userId: 'user_id',
  sessionId: 'session_id',
  refreshTokenId: 'refresh_token_id',
  lastHeartbeat: 'last_heartbeat',
  userAgent: 'user_agent',
  codeHash: 'code_hash',
  expiresAt: 'expires_at',
  maxAttempts: 'max_attempts',
  tokenHash: 'token_hash',
  mediaUrl: 'media_url',
  thumbnailUrl: 'thumbnail_url',
  preferredDate: 'preferred_date',
  isVerified: 'is_verified',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const revFieldMap = Object.fromEntries(Object.entries(fieldMap).map(([k,v]) => [v,k]));

function toDb(key) { return fieldMap[key] || key.replace(/[A-Z]/g, m => '_' + m.toLowerCase()); }
function fromDbRow(row) {
  if (!row) return null;
  const out = {};
  for (const [k,v] of Object.entries(row)) {
    out[revFieldMap[k] || k] = v;
  }
  return out;
}

function wrapDoc(collection, doc) {
  if (!doc) return null;
  const d = { ...doc };
  d.save = async () => {
    const updated = await collection.findByIdAndUpdate(d._id, d);
    Object.assign(d, updated || {});
    return d;
  };
  return d;
}

function buildWhere(filter = {}, startIndex = 1) {
  const entries = Object.entries(filter).filter(([_,v]) => v !== undefined);
  if (!entries.length) return { clause: '', values: [], next: startIndex };
  const parts = [];
  const values = [];
  let i = startIndex;
  for (const [k,v] of entries) {
    parts.push(`${toDb(k)} = $${i++}`);
    values.push(v);
  }
  return { clause: `WHERE ${parts.join(' AND ')}`, values, next: i };
}

function makePgCollection(name) {
  const table = tableMap[name];
  const col = {
    async create(data) {
      const doc = { _id: newId(), createdAt: now(), updatedAt: now(), ...data };
      const keys = Object.keys(doc);
      const cols = keys.map(toDb);
      const vals = keys.map(k => doc[k]);
      const placeholders = vals.map((_,i)=>`$${i+1}`);
      const sql = `INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders.join(',')}) RETURNING *`;
      const { rows } = await pgPool.query(sql, vals);
      return wrapDoc(col, fromDbRow(rows[0]));
    },
    async insertMany(arr) {
      const results = [];
      for (const data of arr) results.push(await col.create(data));
      return results;
    },
    find(filter = {}) {
      let order = 'ORDER BY created_at DESC';
      const run = async () => {
        const { clause, values } = buildWhere(filter);
        const { rows } = await pgPool.query(`SELECT * FROM ${table} ${clause} ${order}`, values);
        return rows.map(r => wrapDoc(col, fromDbRow(r)));
      };
      const chain = {
        sort(spec) { if (spec && spec.createdAt === -1) order = 'ORDER BY created_at DESC'; return chain; },
        select() { return chain; },
        then(resolve, reject) { return run().then(resolve, reject); },
        catch(reject) { return run().catch(reject); },
      };
      return chain;
    },
    findOne(filter = {}) {
      let order = 'ORDER BY created_at DESC';
      const run = async () => {
        const { clause, values } = buildWhere(filter);
        const { rows } = await pgPool.query(`SELECT * FROM ${table} ${clause} ${order} LIMIT 1`, values);
        return wrapDoc(col, fromDbRow(rows[0]));
      };
      const chain = {
        sort(spec) { if (spec && spec.createdAt === -1) order = 'ORDER BY created_at DESC'; return chain; },
        select() { return chain; },
        then(resolve, reject) { return run().then(resolve, reject); },
        catch(reject) { return run().catch(reject); },
      };
      return chain;
    },
    findById(idVal) {
      const run = async () => {
        const { rows } = await pgPool.query(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1`, [idVal]);
        return wrapDoc(col, fromDbRow(rows[0]));
      };
      const chain = {
        select() { return chain; },
        then(resolve, reject) { return run().then(resolve, reject); },
        catch(reject) { return run().catch(reject); },
      };
      return chain;
    },
    async findByIdAndUpdate(idVal, data) {
      const patch = { ...data, updatedAt: now() };
      delete patch._id; delete patch.id; delete patch.createdAt; delete patch.created_at;
      const keys = Object.keys(patch);
      if (!keys.length) return col.findById(idVal);
      const sets = keys.map((k,i)=>`${toDb(k)} = $${i+1}`);
      const vals = keys.map(k=>patch[k]);
      vals.push(idVal);
      const { rows } = await pgPool.query(`UPDATE ${table} SET ${sets.join(', ')} WHERE id = $${vals.length} RETURNING *`, vals);
      return wrapDoc(col, fromDbRow(rows[0]));
    },
    async findByIdAndDelete(idVal) {
      const { rows } = await pgPool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [idVal]);
      return wrapDoc(col, fromDbRow(rows[0]));
    },
    async deleteMany(filter = {}) {
      const { clause, values } = buildWhere(filter);
      const res = await pgPool.query(`DELETE FROM ${table} ${clause}`, values);
      return { deletedCount: res.rowCount };
    },
    async updateMany(filter = {}, update = {}) {
      const set = { ...(update.$set || update), updatedAt: now() };
      const setKeys = Object.keys(set);
      const { clause, values, next } = buildWhere(filter, 1);
      const sets = setKeys.map((k,i)=>`${toDb(k)} = $${i+1}`);
      const setVals = setKeys.map(k=>set[k]);
      const res = await pgPool.query(`UPDATE ${table} SET ${sets.join(', ')} ${clause.replace(/\$(\d+)/g, (_,n)=>`$${Number(n)+setVals.length}`)}`, [...setVals, ...values]);
      return { modifiedCount: res.rowCount };
    },
    async updateOne(filter = {}, update = {}, opts = {}) {
      const set = { ...(update.$set || update), updatedAt: now() };
      const { clause, values } = buildWhere(filter);
      const existing = await pgPool.query(`SELECT id FROM ${table} ${clause} LIMIT 1`, values);
      if (existing.rows[0]) {
        await col.findByIdAndUpdate(existing.rows[0].id, set);
        return { modifiedCount: 1 };
      }
      if (opts.upsert) {
        await col.create({ ...filter, ...set });
        return { upsertedCount: 1 };
      }
      return { modifiedCount: 0 };
    },
    async countDocuments(filter = {}) {
      const { clause, values } = buildWhere(filter);
      const { rows } = await pgPool.query(`SELECT COUNT(*)::int AS count FROM ${table} ${clause}`, values);
      return rows[0]?.count || 0;
    },
  };
  return col;
}

export const pgStore = {
  users: makePgCollection('users'),
  sessions: makePgCollection('sessions'),
  verificationCodes: makePgCollection('verificationCodes'),
  tokenBlacklist: makePgCollection('tokenBlacklist'),
  portfolio: makePgCollection('portfolio'),
  bookings: makePgCollection('bookings'),
  messages: makePgCollection('messages'),
};
