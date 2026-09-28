import nodemailer from 'nodemailer';
import { Todo } from './models.js';
import { deadline } from './validation.js';
export async function sendReminders(transport, from, now = Date.now()) {
  const cursor = Todo.find({ done: false, reminderSent: false }).cursor();
  for await (const todo of cursor) {
    const remaining = deadline(todo.targetDate) - now;
    if (!(remaining > 0 && remaining <= 12 * 3600000)) continue;
    const claimTime = new Date();
    const claimed = await Todo.findOneAndUpdate({ _id: todo._id, done: false, reminderSent: false, targetDate: todo.targetDate,
      $or: [{ reminderClaimedAt: null }, { reminderClaimedAt: { $lt: new Date(now - 600000) } }] }, { reminderClaimedAt: claimTime }, { new: true });
    if (!claimed) continue;
    const claim = { _id: todo._id, reminderClaimedAt: claimTime };
    try {
      await transport.sendMail({ from, to: todo.userEmail, subject: 'SkillPath task deadline reminder',
        text: `Task: ${todo.description}\nDeadline: ${todo.targetDate}\nRemaining: ${Math.floor(remaining / 3600000)} hours ${Math.floor(remaining / 60000) % 60} minutes` });
      await Todo.updateOne(claim, { $set: { reminderSent: true }, $unset: { reminderClaimedAt: 1 } });
    } catch {
      await Todo.updateOne(claim, { $unset: { reminderClaimedAt: 1 } });
      console.error('Reminder delivery failed; will retry');
    }
  }
}
export function startReminders(env) {
  if (!env.SMTP_HOST || !env.SMTP_FROM) return () => {};
  const transport = nodemailer.createTransport({ host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: env.SMTP_SECURE === 'true',
    connectionTimeout: 30000, socketTimeout: 60000,
    ...(env.SMTP_USER ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } } : {}) });
  let running = false;
  const timer = setInterval(async () => {
    if (running) return; running = true;
    try { await sendReminders(transport, env.SMTP_FROM); } catch { console.error('Reminder database check failed'); } finally { running = false; }
  }, 120000);
  timer.unref(); return () => { clearInterval(timer); transport.close(); };
}
