# SkillPath MERN backend

Express + MongoDB replacement for `backend/src/main/java/com/learnjava/springsecurity`, with the existing React frontend. The Java implementation remains available for rollback. Run **one** backend on port 8080.

## Run

Requires Node.js 22.16+ (or Node.js 24), MongoDB configured as a replica set (MongoDB Atlas also works), and Ollama for AI features.

```bash
cd backend-node
npm ci
cp .env.example .env
# Edit .env: set MONGODB_URI and a random JWT_SECRET (at least 32 characters).
# Example secret generator: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Set OLLAMA_MODEL to a model you have installed, for example:
ollama pull llama3.2
npm start
```

Run Ollama with `ollama serve` if it is not already running. In another terminal, run the existing React app with `cd frontend && npm ci && npm start`. Both clients already use port 8080.

For local MongoDB with Docker:

```bash
docker run -d --name skillpath-mongo -p 127.0.0.1:27017:27017 mongo:7 --replSet rs0 --bind_ip_all
docker exec skillpath-mongo mongosh --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
```

Set `MONGODB_URI=mongodb://127.0.0.1:27017/skillpath?replicaSet=rs0`. Replica-set transactions are required to save an analysis and its generated tasks together, and to persist chat turns together.

## API compatibility

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/` | Welcome text |
| POST | `/user` | Register with firstName, lastName, email, password |
| POST | `/authenticate` | Returns `[jwt, firstName]` |
| GET | `/test` | Authenticated diagnostic |
| GET / POST | `/users/:username/todos` | List / create tasks |
| GET | `/users/:username/todos/ai` | AI tasks |
| GET / DELETE | `/todos/:id` | Read / delete owned task |
| PUT | `/users/:username/todos/:id` | Update task |
| POST | `/api/career/analyze/:username` | Multipart resume PDF, jobDescription, optional targetRole |
| GET | `/api/career/history/:username` | Analysis history |
| GET | `/api/career/history/:username/:analysisId` | Analysis and generated tasks |
| POST | `/api/career/ask/:username` | JSON analysisId, conversationId (optional), question |
| POST | `/api/career/ask-stream/:username` | Same input, server-sent events |
| GET | `/api/career/chat/:username/:analysisId` | Persistent chat messages |
| GET | `/ai/stream?query=...` | General AI stream |

Protected routes require `Authorization: Bearer <jwt>`. `username` is the user's email. Email matching is normalized to lowercase. Task JSON uses `id` and `done`. IDs are MongoDB ObjectId **strings**; callers must not convert them to numbers. Registration enforces 8–72 character passwords and bcrypt's 72-byte maximum. Manual requests cannot set ownership, AI provenance or reminder state.

Analysis responses preserve `{analysisId, conversationId, analysis, savedTodos}` and the Java DTO field names. Ollama returns schema-constrained JSON, which is validated before database writes. Empty todoTasks fall back to missingSkills. Chat uses the latest 20 persisted messages and saved analysis summaries. PDF upload limit is 5 MiB; scanned PDFs without text need OCR before upload.

## Reminders and dates

Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and SMTP_FROM to enable Nodemailer reminders. SMTP_SECURE=true is intended for implicit TLS, typically port 465. Otherwise STARTTLS is used when offered. No email is sent if SMTP is not configured.

A worker checks every two minutes for incomplete tasks due within 12 hours. Date-only values mean 23:59 on that date; datetime-local values use process TZ (Asia/Kolkata in the example). A database claim avoids normal duplicate delivery across workers; failed sends release the claim for retry. SMTP and MongoDB cannot provide an atomic exactly-once guarantee: a crash after mail delivery but before database acknowledgement can cause a duplicate reminder.

## Migration and rollback

This is an application-code migration, **not a migration of existing MySQL records**. Start with a fresh MongoDB database and register again. Existing Spring JWTs are invalid; log out and log back in. To retain old users, tasks and analyses, perform a separate export/import with an old-to-new ID map, remapping analysis IDs and conversation IDs. Never copy old database or SMTP secrets into source control.

To roll back, stop Node and run the original Java backend with its original MySQL database. MongoDB-only writes will not appear in MySQL.

## Verification

```bash
npm test
```

Tests use a real temporary MongoDB replica set via mongodb-memory-server (first run downloads MongoDB). Ollama, PDF extraction and SMTP are stubbed in the application integration tests; they do not contact a model or send real emails. Covered: login response, duplicate registration, invalid auth, task CRUD and ownership, analysis transactions/fallback tasks, malformed AI output, chat ownership/conversation checks, persistent JSON/SSE chat and reminder retry behavior. Configure your own live Ollama/SMTP services for end-to-end verification.

Reference APIs: https://docs.ollama.com/api/chat and https://expressjs.com/en/guide/error-handling/.

### Validation in the migration workspace

Three standalone checks passed (`npm run test:unit`). The five MongoDB integration scenarios could not execute because the host refused MongoDB startup with `open: Operation not permitted`; they are included for execution on your local machine or CI. Live Ollama, PDF extraction and SMTP have not been end-to-end verified.
