import PortfolioItem from '../models/PortfolioItem.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listPortfolio = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  const items = await PortfolioItem.find(filter).sort({ createdAt: -1 });
  res.json({ items });
});

export const getPortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ item });
});

export const createPortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.create(req.body);
  res.status(201).json({ item });
});

export const updatePortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ item });
});

export const deletePortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});
