import { useEffect, useState } from 'react';
import api from '../api/client';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

const emptyItem = { title: '', description: '', category: 'Music', type: 'image', mediaUrl: '', thumbnailUrl: '', featured: false };

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('portfolio');
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  const load = async () => {
    try {
      const [p, b, m] = await Promise.all([api.get('/portfolio'), api.get('/bookings'), api.get('/messages')]);
      setItems(p.data.items || []); setBookings(b.data.bookings || []); setMessages(m.data.messages || []);
    } catch (e) { setNotice(e.response?.data?.message || 'Failed to load admin data'); }
  };
  useEffect(() => { load(); }, []);

  const saveItem = async (e) => {
    e.preventDefault(); setNotice('');
    try {
      if (editing) await api.put(`/portfolio/${editing}`, form);
      else await api.post('/portfolio', form);
      setForm(emptyItem); setEditing(null); setNotice('Portfolio saved.'); load();
    } catch (e) { setNotice(e.response?.data?.message || 'Save failed'); }
  };
  const editItem = (it) => { setEditing(it._id); setForm({ title: it.title, description: it.description||'', category: it.category, type: it.type, mediaUrl: it.mediaUrl, thumbnailUrl: it.thumbnailUrl||'', featured: !!it.featured }); };
  const delItem = async (id) => { if (!confirm('Delete item?')) return; await api.delete(`/portfolio/${id}`); load(); };
  const delBooking = async (id) => { if (!confirm('Delete booking?')) return; await api.delete(`/bookings/${id}`); load(); };
  const delMessage = async (id) => { if (!confirm('Delete message?')) return; await api.delete(`/messages/${id}`); load(); };

  return (
    <section className="section">
      <SEO title="Admin Dashboard" description="Manage portfolio, bookings, and messages." />
      <div className="container">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-sub">Welcome, {user?.name}. Manage portfolio, bookings, and messages.</p>
        {notice && <div className="alert" style={{marginBottom:'1rem'}}>{notice}</div>}
        <div style={{display:'flex', gap:'.5rem', marginBottom:'1rem', flexWrap:'wrap'}}>
          {['portfolio','bookings','messages'].map(t => <button key={t} className={`btn ${tab===t?'btn-primary':'btn-outline'}`} onClick={()=>setTab(t)}>{t}</button>)}
        </div>

        {tab === 'portfolio' && (
          <div className="grid" style={{gridTemplateColumns:'1.1fr 1fr'}}>
            <div className="card"><div className="card-body">
              <h3 style={{marginTop:0}}>{editing ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h3>
              <form onSubmit={saveItem} className="form-grid">
                <div><label>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
                <div><label>Description</label><textarea rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
                <div><label>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Music','Video','Film','Photography','Sports'].map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="image">image</option><option value="video">video</option></select></div>
                <div><label>Media URL (repo path or external URL)</label><input value={form.mediaUrl} onChange={e=>setForm({...form,mediaUrl:e.target.value})} required /></div>
                <div><label>Thumbnail URL</label><input value={form.thumbnailUrl} onChange={e=>setForm({...form,thumbnailUrl:e.target.value})} /></div>
                <label style={{display:'flex',gap:'.5rem',alignItems:'center'}}><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} style={{width:'auto'}} /> Featured</label>
                <div style={{display:'flex',gap:'.5rem'}}><button className="btn btn-primary">{editing?'Update':'Create'}</button>{editing && <button type="button" className="btn btn-outline" onClick={()=>{setEditing(null);setForm(emptyItem);}}>Cancel</button>}</div>
              </form>
            </div></div>
            <div className="card"><div className="card-body table-wrap">
              <h3 style={{marginTop:0}}>Items</h3>
              <table><thead><tr><th>Title</th><th>Category</th><th></th></tr></thead><tbody>
                {items.map(it => <tr key={it._id}><td>{it.title}</td><td>{it.category}</td><td style={{whiteSpace:'nowrap'}}><button className="btn btn-outline" onClick={()=>editItem(it)}>Edit</button> <button className="btn btn-outline" onClick={()=>delItem(it._id)}>Delete</button></td></tr>)}
                {!items.length && <tr><td colSpan="3" className="muted">No items</td></tr>}
              </tbody></table>
            </div></div>
          </div>
        )}

        {tab === 'bookings' && (
          <div className="card"><div className="card-body table-wrap"><h3 style={{marginTop:0}}>Bookings</h3>
            <table><thead><tr><th>Name</th><th>Email</th><th>Service</th><th>Message</th><th></th></tr></thead><tbody>
              {bookings.map(b => <tr key={b._id}><td>{b.name}</td><td>{b.email}</td><td>{b.service}</td><td>{b.message}</td><td><button className="btn btn-outline" onClick={()=>delBooking(b._id)}>Delete</button></td></tr>)}
              {!bookings.length && <tr><td colSpan="5" className="muted">No bookings</td></tr>}
            </tbody></table>
          </div></div>
        )}

        {tab === 'messages' && (
          <div className="card"><div className="card-body table-wrap"><h3 style={{marginTop:0}}>Messages</h3>
            <table><thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Content</th><th></th></tr></thead><tbody>
              {messages.map(m => <tr key={m._id}><td>{m.name}</td><td>{m.email}</td><td>{m.subject||'-'}</td><td>{m.content}</td><td><button className="btn btn-outline" onClick={()=>delMessage(m._id)}>Delete</button></td></tr>)}
              {!messages.length && <tr><td colSpan="5" className="muted">No messages</td></tr>}
            </tbody></table>
          </div></div>
        )}
      </div>
    </section>
  );
}
