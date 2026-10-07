import { query } from '../config/db.js';
import { calculateConversationInsights } from '../utils/vibeAnalyzer.js';

// Fallback in-memory state if database is connecting
const inMemoryConversations = [
  { id: 1, title: 'Q4 Product Roadmap & Sprint Sync', currentVibe: 'Collaborative', messageCount: 4 },
  { id: 2, title: 'Feature Launch Celebration 🎉', currentVibe: 'Excited', messageCount: 2 },
  { id: 3, title: 'Server Incident Response 😤', currentVibe: 'Frustrated', messageCount: 2 },
  { id: 4, title: 'Weekly Design Sync 😊', currentVibe: 'Positive', messageCount: 1 },
  { id: 5, title: 'General Watercooler 😐', currentVibe: 'Neutral', messageCount: 1 },
];

const sampleDefaultMessages = [
  { id: 1, content: 'Good morning team! We need to lock in the Q4 launch dates today. Target is shipping v1 beta by end of this week. Are we on track?', vibe: 'Collaborative', sender_name: 'Elena Rostova' },
  { id: 2, content: 'Postgres schema migrations are 90% ready. I will finalize PostgreSQL schema indexing by 2 PM so Alex can run the frontend load benchmarks.', vibe: 'Positive', sender_name: 'Samrudhi Patel' },
  { id: 3, content: 'Component library is feeling super fast. Just merged the new sentiment analysis streaming hooks into staging. The live telemetry updates seamlessly!', vibe: 'Excited', sender_name: 'Alex Rivera' },
  { id: 4, content: 'Inspecting the design tokens now. Typography rhythm and glassmorphism contrast meet all accessibility specs. Let’s do a quick sync before code freeze.', vibe: 'Collaborative', sender_name: 'Liam Vance' },
];

// Get list of conversations
export const getConversations = async (req, res) => {
  try {
    const text = `
      SELECT 
        c.id, 
        c.title, 
        c.created_at as "createdAt",
        c.updated_at as "updatedAt",
        (
          SELECT json_build_object(
            'id', m.id,
            'content', m.content,
            'vibe', m.vibe,
            'senderName', u.name,
            'timestamp', m.created_at
          )
          FROM messages m
          LEFT JOIN users u ON m.user_id = u.id
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) as "lastMessage",
        (
          SELECT m.vibe
          FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) as "currentVibe",
        (SELECT COUNT(*)::int FROM messages WHERE conversation_id = c.id) as "messageCount"
      FROM conversations c
      ORDER BY c.updated_at DESC, c.id DESC;
    `;
    const result = await query(text);
    return res.json({
      success: true,
      conversations: result.rows.map((row) => ({
        ...row,
        currentVibe: row.currentVibe || 'Collaborative',
      })),
    });
  } catch (err) {
    console.warn('Database query fallback in getConversations:', err.message);
    return res.json({ success: true, conversations: inMemoryConversations, source: 'in-memory-fallback' });
  }
};

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { title, createdBy } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const userId = createdBy || 1;

    const insertText = `
      INSERT INTO conversations (title)
      VALUES ($1)
      RETURNING id, title, created_at as "createdAt", updated_at as "updatedAt";
    `;
    const result = await query(insertText, [title.trim()]);
    const newConv = result.rows[0];

    // Add member
    await query(
      `INSERT INTO conversation_members (conversation_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (conversation_id, user_id) DO NOTHING;`,
      [newConv.id, userId]
    );

    return res.status(201).json({
      success: true,
      conversation: {
        ...newConv,
        currentVibe: 'Collaborative',
        messageCount: 0,
      },
    });
  } catch (err) {
    console.warn('Database fallback in createConversation:', err.message);
    const fallbackConv = {
      id: Date.now(),
      title: req.body.title.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentVibe: 'Collaborative',
      messageCount: 0,
    };
    return res.status(201).json({ success: true, conversation: fallbackConv, source: 'in-memory-fallback' });
  }
};

// Get single conversation details
export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT id, title, created_at as "createdAt", updated_at as "updatedAt"
       FROM conversations WHERE id = $1;`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    return res.json({ success: true, conversation: result.rows[0] });
  } catch (err) {
    console.warn('Database fallback in getConversationById:', err.message);
    const conv = inMemoryConversations.find(c => String(c.id) === String(req.params.id)) || inMemoryConversations[0];
    return res.json({ success: true, conversation: conv, source: 'in-memory-fallback' });
  }
};

// Get conversation insights
export const getConversationInsights = async (req, res) => {
  try {
    const { id } = req.params;

    const messagesResult = await query(
      `SELECT m.id, m.content, m.vibe, m.created_at, u.name as sender_name
       FROM messages m
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC;`,
      [id]
    );

    const insights = calculateConversationInsights(messagesResult.rows);
    return res.json({ success: true, insights });
  } catch (err) {
    console.warn('Database fallback in getConversationInsights:', err.message);
    const insights = calculateConversationInsights(sampleDefaultMessages);
    return res.json({ success: true, insights, source: 'in-memory-fallback' });
  }
};
