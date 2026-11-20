import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import api from '../api/client';
import SEO from '../components/SEO';
import Alert from '../components/Alert';
import Field from '../components/Field';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { RowsSkeleton } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { PORTFOLIO_CATEGORIES } from '../data/site';

const CATEGORIES = PORTFOLIO_CATEGORIES.filter((c) => c !== 'All');
const emptyItem = {
  title: '',
  description: '',
  category: 'Music',
  type: 'image',
  mediaUrl: '',
  thumbnailUrl: '',
  featured: false,
};

const TABS = [
  { id: 'portfolio', label: 'Portfolio', Icon: ImageIcon },
  { id: 'bookings', label: 'Bookings', Icon: CalendarDays },
  { id: 'messages', label: 'Messages', Icon: Inbox },
];

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('portfolio');
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [p, b, m] = await Promise.all([api.get('/portfolio'), api.get('/bookings'), api.get('/messages')]);
      setItems(p.data.items || []);
      setBookings(b.data.bookings || []);
      setMessages(m.data.messages || []);
    } catch (e) {
      setNotice({ type: 'error', msg: e.response?.data?.message || 'Failed to load admin data.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(
    () => [
      { label: 'Portfolio items', value: items.length, Icon: ImageIcon },
      { label: 'Featured', value: items.filter((i) => i.featured).length, Icon: Star },
      { label: 'Bookings', value: bookings.length, Icon: CalendarDays },
      { label: 'Messages', value: messages.length, Icon: Mail },
    ],
    [items, bookings, messages],
  );

  const counts = { portfolio: items.length, bookings: bookings.length, messages: messages.length };

  const saveItem = async (e) => {
    e.preventDefault();
    setNotice({ type: '', msg: '' });
    setSaving(true);
    try {
      if (editing) await api.put(`/portfolio/${editing}`, form);
      else await api.post('/portfolio', form);
      setForm(emptyItem);
      setEditing(null);
      setNotice({ type: 'success', msg: editing ? 'Portfolio item updated.' : 'Portfolio item created.' });
      load(true);
    } catch (e2) {
      setNotice({ type: 'error', msg: e2.response?.data?.message || 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const editItem = (it) => {
    setEditing(it._id);
    setForm({
      title: it.title,
      description: it.description || '',
      category: it.category,
      type: it.type,
      mediaUrl: it.mediaUrl,
      thumbnailUrl: it.thumbnailUrl || '',
      featured: !!it.featured,
    });
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyItem);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { kind, id } = pendingDelete;
    const endpoint = { portfolio: '/portfolio', booking: '/bookings', message: '/messages' }[kind];
    setPendingDelete(null);
    try {
      await api.delete(`${endpoint}/${id}`);
      setNotice({ type: 'success', msg: 'Deleted successfully.' });
      if (kind === 'portfolio' && editing === id) cancelEdit();
      load(true);
    } catch (e) {
      setNotice({ type: 'error', msg: e.response?.data?.message || 'Delete failed.' });
    }
  };

  return (
    <>
      <SEO title="Admin Dashboard" description="Manage portfolio, bookings and messages." />

      <section className="section">
        <div className="container">
          <div className="admin-head">
            <div>
              <p className="eyebrow" style={{ marginBottom: '.5rem' }}>
                <LayoutDashboard size={13} aria-hidden="true" /> Studio dashboard
              </p>
              <h1 style={{ marginBottom: '.35rem' }}>Welcome back, {user?.name || 'admin'}</h1>
              <p className="muted" style={{ margin: 0 }}>
                Manage the portfolio gallery, booking requests and contact messages.
              </p>
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => load()} disabled={loading}>
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <div className="stat-grid">
            {stats.map(({ label, value, Icon }) => (
              <div className="stat-card" key={label}>
                <span className="icon-tile">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="stat-value">{loading ? '—' : value}</span>
                  <span className="stat-label">{label}</span>
                </span>
              </div>
            ))}
          </div>

          {notice.msg && (
            <div style={{ marginBottom: '1.25rem' }}>
              <Alert type={notice.type || 'info'}>{notice.msg}</Alert>
            </div>
          )}

          <div className="tabs" role="tablist" aria-label="Dashboard sections" style={{ marginBottom: '1.5rem' }}>
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                role="tab"
                type="button"
                id={`tab-${id}`}
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                className={`tab${tab === id ? ' is-active' : ''}`}
                onClick={() => setTab(id)}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
                <span className="count">{counts[id]}</span>
              </button>
            ))}
          </div>

          {/* ------------------------------------------------------ Portfolio */}
          {tab === 'portfolio' && (
            <div className="admin-grid" role="tabpanel" id="panel-portfolio" aria-labelledby="tab-portfolio">
              <form className="card" onSubmit={saveItem}>
                <div className="card-body form-grid">
                  <div className="cluster" style={{ justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: 'var(--fs-h3)', margin: 0 }}>
                      {editing ? 'Edit item' : 'Add portfolio item'}
                    </h2>
                    {editing && (
                      <button type="button" className="icon-btn" onClick={cancelEdit} aria-label="Cancel editing">
                        <X size={17} />
                      </button>
                    )}
                  </div>

                  <Field id="title" label="Title" required>
                    <input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Sunrise Over Kuria"
                      required
                    />
                  </Field>

                  <Field id="description" label="Description">
                    <textarea
                      id="description"
                      rows="3"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Short summary shown on the card."
                    />
                  </Field>

                  <div className="form-row">
                    <Field id="category" label="Category">
                      <select
                        id="category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>

                    <Field id="type" label="Type">
                      <select id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </Field>
                  </div>

                  <Field id="mediaUrl" label="Media URL" required hint="Repository path (/assets/…) or a full external URL.">
                    <input
                      id="mediaUrl"
                      value={form.mediaUrl}
                      onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                      placeholder="/assets/portfolio/music-session.jpg"
                      required
                    />
                  </Field>

                  <Field id="thumbnailUrl" label="Thumbnail URL" hint="Optional — falls back to the media URL.">
                    <input
                      id="thumbnailUrl"
                      value={form.thumbnailUrl}
                      onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                      placeholder="/assets/portfolio/music-session.jpg"
                    />
                  </Field>

                  {(form.thumbnailUrl || form.mediaUrl) && form.type === 'image' && (
                    <div
                      style={{
                        borderRadius: 'var(--r-md)',
                        overflow: 'hidden',
                        border: '1px solid var(--border)',
                        aspectRatio: '16 / 9',
                        background: '#000',
                      }}
                    >
                      <img
                        src={form.thumbnailUrl || form.mediaUrl}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    />
                    Feature on the home page
                  </label>

                  <div className="cluster">
                    <button className="btn btn-primary" disabled={saving} type="submit">
                      {saving ? (
                        <>
                          <span className="spinner" aria-hidden="true" />
                          Saving…
                        </>
                      ) : (
                        <>
                          {editing ? <Save size={16} /> : <Plus size={16} />}
                          {editing ? 'Update item' : 'Create item'}
                        </>
                      )}
                    </button>
                    {editing && (
                      <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>

              <div className="card">
                <div className="card-body">
                  <h2 style={{ fontSize: 'var(--fs-h3)', marginTop: 0 }}>Gallery items</h2>
                  {loading ? (
                    <RowsSkeleton rows={4} />
                  ) : items.length ? (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((it) => (
                            <tr key={it._id}>
                              <td className="strong">
                                {it.title}
                                {it.featured && (
                                  <span className="badge" style={{ marginLeft: '.5rem' }}>
                                    <Star size={10} fill="currentColor" aria-hidden="true" /> Featured
                                  </span>
                                )}
                              </td>
                              <td>{it.category}</td>
                              <td>{it.type}</td>
                              <td>
                                <div className="row-actions">
                                  <button
                                    type="button"
                                    className="icon-btn"
                                    onClick={() => editItem(it)}
                                    aria-label={`Edit ${it.title}`}
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="icon-btn icon-btn-danger"
                                    onClick={() => setPendingDelete({ kind: 'portfolio', id: it._id, label: it.title })}
                                    aria-label={`Delete ${it.title}`}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState
                      icon={ImageIcon}
                      title="No portfolio items yet"
                      message="Add your first project using the form — featured items also appear on the home page."
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- Bookings */}
          {tab === 'bookings' && (
            <div className="card" role="tabpanel" id="panel-bookings" aria-labelledby="tab-bookings">
              <div className="card-body">
                <h2 style={{ fontSize: 'var(--fs-h3)', marginTop: 0 }}>Booking requests</h2>
                {loading ? (
                  <RowsSkeleton rows={5} />
                ) : bookings.length ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Service</th>
                          <th>Details</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b._id}>
                            <td className="strong">
                              {b.name}
                              <div className="faint" style={{ fontWeight: 400 }}>
                                <a href={`mailto:${b.email}`}>{b.email}</a>
                                {b.phone ? ` · ${b.phone}` : ''}
                              </div>
                            </td>
                            <td>
                              {b.service}
                              {b.preferredDate && (
                                <div className="faint">{new Date(b.preferredDate).toLocaleDateString()}</div>
                              )}
                            </td>
                            <td>
                              <span className="cell-clamp">{b.message}</span>
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  type="button"
                                  className="icon-btn icon-btn-danger"
                                  onClick={() => setPendingDelete({ kind: 'booking', id: b._id, label: `booking from ${b.name}` })}
                                  aria-label={`Delete booking from ${b.name}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState icon={CalendarDays} title="No booking requests yet" message="New requests from the booking form land here." />
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- Messages */}
          {tab === 'messages' && (
            <div className="card" role="tabpanel" id="panel-messages" aria-labelledby="tab-messages">
              <div className="card-body">
                <h2 style={{ fontSize: 'var(--fs-h3)', marginTop: 0 }}>Messages</h2>
                {loading ? (
                  <RowsSkeleton rows={5} />
                ) : messages.length ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>From</th>
                          <th>Subject</th>
                          <th>Message</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((m) => (
                          <tr key={m._id}>
                            <td className="strong">
                              {m.name}
                              <div className="faint" style={{ fontWeight: 400 }}>
                                <a href={`mailto:${m.email}`}>{m.email}</a>
                              </div>
                            </td>
                            <td>{m.subject || '—'}</td>
                            <td>
                              <span className="cell-clamp">{m.content}</span>
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  type="button"
                                  className="icon-btn icon-btn-danger"
                                  onClick={() => setPendingDelete({ kind: 'message', id: m._id, label: `message from ${m.name}` })}
                                  aria-label={`Delete message from ${m.name}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState icon={Inbox} title="No messages yet" message="Contact messages from the website appear in this inbox." />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this item?"
        message={pendingDelete ? `“${pendingDelete.label}” will be permanently removed. This cannot be undone.` : ''}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
