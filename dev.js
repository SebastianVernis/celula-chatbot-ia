#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use('/assets', express.static(join(__dirname, 'src/assets')));
app.use('/css', express.static(join(__dirname, 'src/css')));
app.use('/js', express.static(join(__dirname, 'src/js')));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'src/html/index.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(join(__dirname, 'src/html/blog.html'));
});

app.get('/cotizador', (req, res) => {
  res.sendFile(join(__dirname, 'src/html/cotizador.html'));
});

app.get('/post/:id', (req, res) => {
  const postPath = join(__dirname, 'src/html/post', `post-${req.params.id}.html`);
  if (existsSync(postPath)) {
    res.sendFile(postPath);
  } else {
    res.status(404).send('Post not found');
  }
});

// API proxy for development
app.post('/api/send-email', async (req, res) => {
  console.log('📧 Email request received:', req.body);
  res.json({ success: true, message: 'Development mode - email not sent' });
});

app.post('/api/chatbot', async (req, res) => {
  console.log('🤖 Chatbot request received:', req.body);
  res.json({ 
    response: 'Development mode - chatbot response', 
    conversationId: 'dev-' + Date.now() 
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Development server running!`);
  console.log(`\n📍 Local: http://localhost:${PORT}`);
  console.log(`\n💡 Press Ctrl+C to stop\n`);
});
