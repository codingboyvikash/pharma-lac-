import Page from '../models/Page.js';
import { logActivity } from '../utils/activity.js';

export const defaultPages = [
  ['About Us', 'about-us'],
  ['Contact Us', 'contact-us'],
  ['Privacy Policy', 'privacy-policy'],
  ['Terms & Conditions', 'terms-conditions']
];

const ensurePages = async () => {
  await Promise.all(
    defaultPages.map(([title, slug]) =>
      Page.findOneAndUpdate({ slug }, { $setOnInsert: { title, slug } }, { upsert: true, new: true })
    )
  );
};

export const listPages = async (req, res) => {
  await ensurePages();
  res.json(await Page.find().sort({ title: 1 }));
};

export const updatePage = async (req, res) => {
  await ensurePages();
  const page = await Page.findOneAndUpdate(
    { slug: req.params.slug },
    { content: req.body.content || '', status: req.body.status ?? true },
    { new: true }
  );
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }
  await logActivity(`Updated page ${page.title}`, 'update');
  res.json(page);
};
