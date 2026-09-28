import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { deadline, todoInput, analysisOutput } from '../src/validation.js';
import { createOllama } from '../src/ollama.js';
import { Todo, User } from '../src/models.js';
test('startup rejects weak JWT secrets and protected routes reject invalid tokens', async () => {
  assert.throws(() => createApp({ jwtSecret: 'weak' }), /JWT_SECRET/);
  const app = createApp({ jwtSecret: 'x'.repeat(32), origins: ['http://localhost:3000'] });
  await request(app).get('/').expect(200);
  await request(app).get('/users/a@example.com/todos').expect(401);
  await request(app).get('/test').set('Authorization', 'Bearer bad').expect(401);
  await request(app).post('/user').send({ email: 'bad', password: 'short' }).expect(400);
});
test('schemas reject invalid dates, boolean coercion and AI fields; serialize React DTOs', () => {
  assert.ok(Number.isNaN(deadline('2026-02-30')));
  assert.ok(Number.isFinite(deadline('2028-02-29')));
  assert.equal(todoInput.safeParse({ description: 'Task', targetDate: '2026-10-01', done: 'false' }).success, false);
  assert.equal(analysisOutput.safeParse({ atsScore: 200 }).success, false);
  const dto = new Todo({ username: 'owner', description: 'Task' }).toJSON();
  assert.equal(typeof dto.id, 'string'); assert.equal(dto.done, false); assert.equal(dto.username, undefined);
  assert.equal(new User({ email: 'a@example.com', password: 'secret' }).toJSON().password, undefined);
});
test('Ollama adapter reassembles fragmented UTF-8 NDJSON and rejects incomplete streams', async () => {
  let incomplete = false;
  const server = http.createServer((_req, res) => {
    res.setHeader('Content-Type', 'application/x-ndjson');
    const data = Buffer.from(JSON.stringify({ message: { content: 'Hello नमस्ते\n' } }) + '\n' + (incomplete ? '' : JSON.stringify({ done: true })));
    for (let i = 0; i < data.length; i += 3) res.write(data.subarray(i, i + 3));
    res.end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const ollama = createOllama({ ollamaUrl: `http://127.0.0.1:${server.address().port}`, ollamaModel: 'test' });
    let result = ''; for await (const chunk of ollama([])) result += chunk;
    assert.equal(result, 'Hello नमस्ते\n'); incomplete = true;
    await assert.rejects(async () => { for await (const _chunk of ollama([])) {} }, /incomplete/);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
