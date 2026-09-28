import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Todo, Analysis, Chat } from '../src/models.js';
import { sendReminders } from '../src/reminders.js';
let mongo, app, token, otherToken, analysisId, conversationId, invalidAi = false;
const email = 'student@example.com';
const analysis = { atsScore: 70, summary: 'Practice MongoDB', resumeSummary: 'React developer', jobDescriptionSummary: 'MERN developer', aiAnalysisSummary: 'Learn MongoDB', missingSkills: ['MongoDB'], todoTasks: [] };
before(async () => {
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  app = createApp({ jwtSecret: 'test-secret-which-is-longer-than-thirty-two-characters', origins: ['http://localhost:3000'] }, {
    extractPdf: async () => 'Resume with React experience',
    ollama: async function* (_messages, options) { if (options.format) yield invalidAi ? '{}' : JSON.stringify(analysis); else { yield 'Learn '; yield 'MongoDB.\nPractice daily.'; } }
  });
  await Promise.all(Object.values(mongoose.models).map(m => m.init()));
});
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });
const auth = () => ({ Authorization: `Bearer ${token}` });
test('registration and login preserve React contract; reject duplicates and bad credentials', async () => {
  await request(app).post('/user').send({ email, password: 'password123', firstName: 'Student', roles: 'ADMIN' }).expect(200);
  await request(app).post('/user').send({ email, password: 'password123', firstName: 'Student' }).expect(409);
  const response = await request(app).post('/authenticate').send({ email: email.toUpperCase(), password: 'password123' }).expect(200);
  [token] = response.body; assert.equal(response.body[1], 'Student');
  await request(app).post('/authenticate').send({ email, password: 'wrong' }).expect(401);
  await request(app).post('/user').send({ email: 'other@example.com', password: 'password123', firstName: 'Other' }).expect(200);
  otherToken = (await request(app).post('/authenticate').send({ email: 'other@example.com', password: 'password123' })).body[0];
});
test('todos: CRUD, validation, ownership, trusted fields and reminder reset', async () => {
  await request(app).get(`/users/${email}/todos`).expect(401);
  await request(app).get(`/users/${email}/todos`).set('Authorization', 'Bearer invalid').expect(401);
  await request(app).get('/users/other@example.com/todos').set(auth()).expect(403);
  await request(app).post(`/users/${email}/todos`).set(auth()).send({ description: '', targetDate: 'bad' }).expect(400);
  const { body: todo } = await request(app).post(`/users/${email}/todos`).set(auth()).send({ description: 'Study', targetDate: '2026-10-01', createdFromAi: true, userEmail: 'attacker@example.com', reminderSent: true }).expect(200);
  assert.equal(todo.done, false); assert.equal(todo.createdFromAi, false); assert.equal(todo.userEmail, email); assert.equal(todo.reminderSent, false);
  await request(app).get(`/todos/${todo.id}`).set('Authorization', `Bearer ${otherToken}`).expect(404);
  await request(app).delete(`/todos/${todo.id}`).set('Authorization', `Bearer ${otherToken}`).expect(404);
  await Todo.updateOne({ _id: todo.id }, { reminderSent: true });
  const updated = await request(app).put(`/users/${email}/todos/${todo.id}`).set(auth()).send({ done: true, targetDate: '2026-10-02' }).expect(200);
  assert.equal(updated.body.done, true); assert.equal(updated.body.reminderSent, false);
  await request(app).delete(`/todos/${todo.id}`).set(auth()).expect(204);
  await request(app).get(`/todos/${todo.id}`).set(auth()).expect(404);
});
test('PDF analysis atomically saves missing-skill tasks and compatible history', async () => {
  await request(app).post(`/api/career/analyze/${email}`).set(auth()).field('jobDescription', 'MERN').attach('resume', Buffer.from('bad'), 'resume.pdf').expect(400);
  const response = await request(app).post(`/api/career/analyze/${email}`).set(auth()).field('jobDescription', 'MERN').attach('resume', Buffer.from('%PDF-test'), 'resume.pdf').expect(200);
  ({ analysisId, conversationId } = response.body);
  assert.equal(response.body.savedTodos.length, 1); assert.equal(response.body.savedTodos[0].createdFromAi, true);
  assert.equal((await request(app).get(`/api/career/history/${email}/${analysisId}`).set(auth()).expect(200)).body.analysis.atsScore, 70);
  await request(app).get(`/api/career/history/other@example.com/${analysisId}`).set('Authorization', `Bearer ${otherToken}`).expect(404);
  invalidAi = true;
  await request(app).post(`/api/career/analyze/${email}`).set(auth()).field('jobDescription', 'MERN').attach('resume', Buffer.from('%PDF-test'), 'resume.pdf').expect(502);
  assert.equal(await Analysis.countDocuments(), 1); invalidAi = false;
});
test('chat validates conversation, persists both roles and streams SSE', async () => {
  await request(app).post(`/api/career/ask/${email}`).set(auth()).send({ analysisId, question: 'Help', conversationId: 'wrong' }).expect(403);
  const response = await request(app).post(`/api/career/ask/${email}`).set(auth()).send({ analysisId, conversationId, question: 'Help' }).expect(200);
  assert.equal(response.body.answer, 'Learn MongoDB.\nPractice daily.');
  const stream = await request(app).post(`/api/career/ask-stream/${email}`).set(auth()).send({ analysisId, question: 'More' }).expect(200);
  assert.match(stream.text, /data:\[DONE\]/); assert.match(stream.text, /data:Practice daily\./);
  const history = await request(app).get(`/api/career/chat/${email}/${analysisId}`).set(auth()).expect(200);
  assert.equal(history.body.length, 4); assert.equal(await Chat.countDocuments(), 4);
});
test('reminders retry failed delivery and mark sent only on success', async () => {
  const now = Date.now(); const todo = await Todo.create({ username: email, userEmail: email, description: 'Deadline', targetDate: new Date(now+3600000).toISOString() });
  await sendReminders({ sendMail: async () => { throw new Error('SMTP down'); } }, 'sender@example.com', now);
  assert.equal((await Todo.findById(todo.id)).reminderSent, false);
  let sent = 0;
  const transport = { sendMail: async () => { sent++; } };
  await sendReminders(transport, 'sender@example.com', now); await sendReminders(transport, 'sender@example.com', now);
  assert.equal(sent, 1); assert.equal((await Todo.findById(todo.id)).reminderSent, true);
});
