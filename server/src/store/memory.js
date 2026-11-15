import crypto from 'crypto';

function id() { return crypto.randomUUID(); }
function now() { return new Date(); }

function match(doc, filter = {}) {
  return Object.entries(filter).every(([k, v]) => {
    if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) return false;
    return String(doc[k]) === String(v);
  });
}

function makeCollection(name, { defaults = {} } = {}) {
  let rows = [];
  function wrap(doc) {
    if (!doc) return null;
    const d = { ...doc };
    d.save = async () => {
      const idx = rows.findIndex(r => String(r._id) === String(d._id));
      d.updatedAt = now();
      if (idx >= 0) rows[idx] = { ...d };
      return d;
    };
    return d;
  }

  return {
    async create(data) {
      const doc = { _id: id(), createdAt: now(), updatedAt: now(), ...defaults, ...data };
      rows.push({ ...doc });
      return wrap({ ...doc });
    },
    async insertMany(arr) {
      const docs = arr.map(data => ({ _id: id(), createdAt: now(), updatedAt: now(), ...defaults, ...data }));
      rows.push(...docs.map(d => ({ ...d })));
      return docs.map(d => wrap({ ...d }));
    },
    findOne(filter = {}) {
      let res = [...rows].filter(r => match(r, filter));
      const chain = {
        sort(spec) {
          if (spec && spec.createdAt === -1) res.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
          else res.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
          return chain;
        },
        select() { return chain; },
        then(resolve, reject) { return Promise.resolve(wrap(res[0] ? { ...res[0] } : null)).then(resolve, reject); },
        catch(reject) { return Promise.resolve(wrap(res[0] ? { ...res[0] } : null)).catch(reject); },
      };
      return chain;
    },
    find(filter = {}) {
      let res = rows.filter(r => match(r, filter)).map(r => ({ ...r }));
      const chain = {
        sort(spec) {
          if (spec && spec.createdAt === -1) res.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
          return chain;
        },
        select() { return chain; },
        then(resolve, reject) { return Promise.resolve(res.map(wrap)).then(resolve, reject); },
        catch(reject) { return Promise.resolve(res.map(wrap)).catch(reject); },
      };
      return chain;
    },
    findById(idVal) {
      const found = rows.find(r => String(r._id) === String(idVal));
      const doc = wrap(found ? { ...found } : null);
      const chain = {
        select() { return chain; },
        then(resolve, reject) { return Promise.resolve(doc).then(resolve, reject); },
        catch(reject) { return Promise.resolve(doc).catch(reject); },
      };
      return chain;
    },
    async findByIdAndUpdate(idVal, data, opts = {}) {
      const idx = rows.findIndex(r => String(r._id) === String(idVal));
      if (idx < 0) return null;
      rows[idx] = { ...rows[idx], ...data, updatedAt: now() };
      return wrap({ ...rows[idx] });
    },
    async findByIdAndDelete(idVal) {
      const idx = rows.findIndex(r => String(r._id) === String(idVal));
      if (idx < 0) return null;
      const [removed] = rows.splice(idx, 1);
      return wrap({ ...removed });
    },
    async deleteMany(filter = {}) {
      const before = rows.length;
      rows = rows.filter(r => !match(r, filter));
      return { deletedCount: before - rows.length };
    },
    async updateMany(filter = {}, update = {}) {
      const set = update.$set || update;
      let n = 0;
      rows = rows.map(r => { if (match(r, filter)) { n++; return { ...r, ...set, updatedAt: now() }; } return r; });
      return { modifiedCount: n };
    },
    async updateOne(filter = {}, update = {}, opts = {}) {
      const set = update.$set || update;
      const idx = rows.findIndex(r => match(r, filter));
      if (idx >= 0) {
        rows[idx] = { ...rows[idx], ...set, updatedAt: now() };
        return { modifiedCount: 1 };
      }
      if (opts.upsert) { await this.create(set); return { upsertedCount: 1 }; }
      return { modifiedCount: 0 };
    },
    async countDocuments(filter = {}) {
      return rows.filter(r => match(r, filter)).length;
    },
    _rows: () => rows,
  };
}

export const memory = {
  users: makeCollection('users'),
  sessions: makeCollection('sessions'),
  verificationCodes: makeCollection('verificationCodes'),
  tokenBlacklist: makeCollection('tokenBlacklist'),
  portfolio: makeCollection('portfolio'),
  bookings: makeCollection('bookings'),
  messages: makeCollection('messages'),
};
