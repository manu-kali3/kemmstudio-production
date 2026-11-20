import { useState } from 'react';
import api from '../api/client';
import SEO from '../components/SEO';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: 'Music Production', preferredDate: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus({ type: '', msg: '' });
    try {
      await api.post('/bookings', form);
      setStatus({ type: 'success', msg: 'Booking request sent successfully. We will get back to you soon.' });
      setForm({ name: '', email: '', phone: '', service: 'Music Production', preferredDate: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to send request.' });
    } finally { setLoading(false); }
  };

  return (
    <section className="section">
      <SEO title="Booking & Contact" description="Book Kemmstudio Production for music, video, film, videography, or photography." />
      <div className="container" style={{maxWidth:800}}>
        <h1 className="section-title">Booking & Contact</h1>
        <p className="section-sub">Tell us about your project and preferred dates. We’ll respond promptly.</p>
        {status.msg && <div className={`alert ${status.type}`} style={{marginBottom:'1rem'}}>{status.msg}</div>}
        <form className="card" onSubmit={onSubmit}>
          <div className="card-body form-grid">
            <div><label htmlFor="name">Name</label><input id="name" name="name" value={form.name} onChange={onChange} required /></div>
            <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" value={form.email} onChange={onChange} required /></div>
            <div><label htmlFor="phone">Phone</label><input id="phone" name="phone" value={form.phone} onChange={onChange} /></div>
            <div><label htmlFor="service">Service</label>
              <select id="service" name="service" value={form.service} onChange={onChange}>
                <option>Music Production</option><option>Video Production</option><option>Film Production</option><option>Videography</option><option>Photography</option><option>Sports / Sports-centre Content</option>
              </select>
            </div>
            <div><label htmlFor="preferredDate">Preferred Date</label><input id="preferredDate" name="preferredDate" type="date" value={form.preferredDate} onChange={onChange} /></div>
            <div><label htmlFor="message">Project Details</label><textarea id="message" name="message" rows="5" value={form.message} onChange={onChange} required /></div>
            <button className="btn btn-primary" disabled={loading} type="submit">{loading ? 'Sending...' : 'Send Booking Request'}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
