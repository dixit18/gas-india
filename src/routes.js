import { Router } from 'express';
import { z } from 'zod';
import { School, Poll, Vote, Flame } from './models.js';
import { SEED_POLLS } from './polls.js';
import mongoose from 'mongoose';

const r = Router();
const dbOn = () => mongoose.connection.readyState === 1;
const mem = {
  schools: [{ _id: 'demo-college', name: 'Demo Arts College', city: 'Pune' }],
  polls: SEED_POLLS.map((p, i) => ({ _id: 'poll' + i, schoolId: 'demo-college', ...p })),
  votes: [],
  flames: [],
};

r.get('/schools', async (req, res) => {
  if (!dbOn()) return res.json({ items: mem.schools, mode: 'memory' });
  res.json({ items: await School.find().limit(50).lean() });
});

r.post('/schools', async (req, res) => {
  const p = z.object({ name: z.string().min(3).max(100), city: z.string().max(60).optional().default('') }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues });
  if (!dbOn()) {
    const s = { _id: String(Date.now()), ...p.data };
    mem.schools.push(s);
    return res.status(201).json({ item: s, mode: 'memory' });
  }
  res.status(201).json({ item: await School.create(p.data) });
});

r.get('/schools/:id/polls', async (req, res) => {
  if (!dbOn()) return res.json({ items: mem.polls.filter((x) => x.schoolId === req.params.id), mode: 'memory' });
  res.json({ items: await Poll.find({ schoolId: req.params.id }).sort({ createdAt: -1 }).limit(24).lean() });
});

r.post('/polls/:id/vote', async (req, res) => {
  const p = z.object({ optionIdx: z.number().min(0).max(3), voterKey: z.string().min(3).max(80), grade: z.string().max(20).optional().default('') }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues });
  if (!dbOn()) {
    if (mem.votes.some((v) => v.pollId === req.params.id && v.voterKey === p.data.voterKey))
      return res.status(409).json({ error: 'already voted' });
    const poll = mem.polls.find((x) => x._id === req.params.id);
    if (!poll) return res.status(404).json({ error: 'poll not found' });
    mem.votes.push({ pollId: req.params.id, ...p.data });
    const picked = poll.options[p.data.optionIdx];
    const flame = { _id: String(Date.now()), toUser: picked, fromHint: p.data.grade ? `classmate (${p.data.grade})` : 'classmate', question: poll.question };
    mem.flames.push(flame);
    return res.status(201).json({ flame: 'sent', mode: 'memory' });
  }
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).json({ error: 'poll not found' });
  try {
    await Vote.create({ pollId: poll._id, ...p.data });
  } catch {
    return res.status(409).json({ error: 'already voted' });
  }
  await Flame.create({ toUser: poll.options[p.data.optionIdx], fromHint: p.data.grade ? `classmate (${p.data.grade})` : 'classmate', question: poll.question });
  res.status(201).json({ flame: 'sent' });
});

r.get('/flames', async (req, res) => {
  const user = String(req.query.user || '');
  if (!user) return res.status(400).json({ error: 'user required' });
  if (!dbOn()) return res.json({ items: mem.flames.filter((f) => f.toUser === user).slice(-50).reverse(), mode: 'memory' });
  res.json({ items: await Flame.find({ toUser: user }).sort({ createdAt: -1 }).limit(50).lean() });
});

export default r;
