import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectPostgres, closeDbs } from '../config/db.js';
import User from '../models/User.js';
import PortfolioItem from '../models/PortfolioItem.js';

dotenv.config();

const portfolioSeed = [
  { title: 'Kuria Rhythms Live Session', description: 'A vibrant Kuria music production capturing traditional rhythms with modern mixing.', category: 'Music', type: 'video', mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/assets/portfolio/music-1.svg', featured: true },
  { title: 'Echoes of the Hills', description: 'Music video production blending Kuria storytelling and cinematic visuals.', category: 'Video', type: 'image', mediaUrl: '/assets/portfolio/video-1.svg', thumbnailUrl: '/assets/portfolio/video-1.svg', featured: true },
  { title: 'Sunrise Over Kuria', description: 'Short film production highlighting culture, entertainment, and community.', category: 'Film', type: 'image', mediaUrl: '/assets/portfolio/film-1.svg', thumbnailUrl: '/assets/portfolio/film-1.svg', featured: true },
  { title: 'Portraits in Motion', description: 'Photography series capturing performers and creators in studio.', category: 'Photography', type: 'image', mediaUrl: '/assets/portfolio/photo-1.svg', thumbnailUrl: '/assets/portfolio/photo-1.svg', featured: false },
  { title: 'Community Sports Centre Highlights', description: 'Sports-centre content and videography showcasing local talent and events.', category: 'Sports', type: 'image', mediaUrl: '/assets/portfolio/sports-1.svg', thumbnailUrl: '/assets/portfolio/sports-1.svg', featured: true },
  { title: 'Matchday Energy', description: 'Fast-paced sports videography and photography coverage.', category: 'Sports', type: 'video', mediaUrl: 'https://www.youtube.com/embed/oHg5SJYRHA0', thumbnailUrl: '/assets/portfolio/sports-2.svg', featured: false },
];

async function seed() {
  await connectPostgres(); // optional; falls back to in-memory if unavailable
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@kemmstudio.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await User.create({ name: 'Kemmstudio Admin', email: adminEmail, password: hashed, role: 'admin', isVerified: true });
    console.log(`[seed] Admin created: ${adminEmail}`);
  } else {
    console.log('[seed] Admin already exists');
  }

  const count = await PortfolioItem.countDocuments();
  if (count === 0) {
    await PortfolioItem.insertMany(portfolioSeed);
    console.log('[seed] Portfolio items inserted');
  } else {
    console.log('[seed] Portfolio already seeded');
  }

  await closeDbs();
  console.log('[seed] Done');
}

seed().catch((e) => { console.error(e); process.exit(1); });
