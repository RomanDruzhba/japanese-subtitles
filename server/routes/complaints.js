// routes/complaints.js
import express from 'express';
import { Complaint } from '../models/Complaint.js';
import { User } from '../models/User.js';
import { Comment } from '../models/Comment.js';
import { transporter } from './mailer.js';

const router = express.Router();

async function loadComplaint(req, res, next) {
  const complaint = await Complaint.findByPk(req.params.id, {
    include: [{ model: User, as: 'targetUser' }]
  });

  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  req.complaint = complaint;
  next();
}

router.get('/', async (req, res) => {
  const complaints = await Complaint.findAll({
    where: { isResolved: false },
    include: [
      { model: User, as: 'complainant', attributes: ['id', 'nickname', 'email'] },
      { model: User, as: 'targetUser', attributes: ['id', 'nickname', 'email'] },
      { model: Comment, attributes: ['id', 'text'] }
    ],
  });
  res.json(complaints);
});

router.post('/', async (req, res) => {
  const { complaintText, complainantId, targetUserId, commentId } = req.body;

  if (!complainantId || !targetUserId || !complaintText || !commentId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const complaint = await Complaint.create({
      complaintText,
      complainantId,
      targetUserId,
      commentId,
      isResolved: false,
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error('Error creating complaint:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/:id/resolve', async (req, res) => {
  const complaint = await Complaint.findByPk(req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  complaint.isResolved = true;
  await complaint.save();
  res.json({ success: true });
});

router.post('/:id/warn', loadComplaint, async (req, res) => {
  const { reason } = req.body;
  const user = req.complaint.targetUser;

  user.warningCount += 1;
  await user.save();

  await transporter.sendMail({
    from: '"Anime Portal" <your_email@gmail.com>',
    to: user.email,
    subject: 'Предупреждение',
    text: `Здравствуйте, ${user.nickname}! Вам выдано предупреждение: ${reason}`,
  });

  res.json({ success: true });
});

router.post('/:id/ban', loadComplaint, async (req, res) => {
  const { duration } = req.body; // duration: '1m' | '6m' | '1y' | 'forever'
  const user = req.complaint.targetUser;

  if (!user) return res.status(404).json({ error: 'Target user not found' });
  user.isBanned = true;

  const now = new Date();
  switch (duration) {
  case '1m':
    user.unbanDate = new Date(now.setMonth(now.getMonth() + 1));
    break;
  case '6m':
    user.unbanDate = new Date(now.setMonth(now.getMonth() + 6));
    break;
  case '1y':
    user.unbanDate = new Date(now.setFullYear(now.getFullYear() + 1));
    break;
  case 'forever':
    user.unbanDate = null;
    break;
  }

  await user.save();
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    await comment.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;