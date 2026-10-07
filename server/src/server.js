import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import conversationRoutes from './routes/conversationRoutes.js';
import { testConnection, initDatabase } from './config/db.js';
import { analyzeMessageVibe } from './utils/vibeAnalyzer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow Vite React client
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Routes
app.use('/api/conversations', conversationRoutes);

// Standalone Vibe Analysis Endpoint
app.post('/api/vibe/analyze', (req, res) => {
  const { text } = req.body;
  const vibe = analyzeMessageVibe(text || '');
  return res.json({ success: true, text, vibe });
});

// Health check endpoint (checks Aiven PostgreSQL connection)
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  return res.json({
    status: 'ok',
    service: 'VibeChat API',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Root ping
app.get('/', (req, res) => {
  res.json({ message: 'VibeChat API is operational. Access endpoints via /api/conversations' });
});

// Start Express Server
app.listen(PORT, async () => {
  console.log(`🚀 VibeChat Express server listening on http://localhost:${PORT}`);
  // Attempt schema init if database is connected
  await initDatabase();
});
