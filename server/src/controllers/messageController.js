import { query } from '../config/db.js';
import { analyzeMessageVibe, calculateConversationInsights } from '../utils/vibeAnalyzer.js';

// In-memory fallback message store if database is offline/reconnecting
const inMemoryMessages = {};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const result = await query(
      `SELECT 
        m.id, 
        m.conversation_id as "conversationId",
        m.user_id as "userId",
        COALESCE(u.name, 'Team Member') as "senderName",
        m.content,
        m.vibe,
        m.created_at as "createdAt"
       FROM messages m
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC;`,
      [conversationId]
    );

    return res.json({ success: true, messages: result.rows });
  } catch (err) {
    console.warn('Database query fallback in getMessages:', err.message);
    const msgs = inMemoryMessages[req.params.conversationId] || [];
    return res.json({ success: true, messages: msgs, source: 'in-memory-fallback' });
  }
};

// Send message & analyze vibe
export const sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { content, userId, vibe: customVibe } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, error: 'Message content cannot be empty' });
  }

  // 1. Analyze message vibe using rule-based analyzer
  const detectedVibe = customVibe || analyzeMessageVibe(content);
  const senderId = userId || 1; // Default to user 1 (Liam Vance)

  try {
    // 2. Insert message into PostgreSQL using parameterized query
    const insertResult = await query(
      `INSERT INTO messages (conversation_id, user_id, content, vibe)
       VALUES ($1, $2, $3, $4)
       RETURNING id, conversation_id as "conversationId", user_id as "userId", content, vibe, created_at as "createdAt";`,
      [conversationId, senderId, content.trim(), detectedVibe]
    );

    const createdMsg = insertResult.rows[0];

    // Fetch user name
    const userResult = await query(
      `SELECT name FROM users WHERE id = $1;`,
      [senderId]
    );
    const senderName = userResult.rows[0]?.name || 'Liam Vance';

    const fullMessage = {
      ...createdMsg,
      senderName,
      isSelf: senderId === 1,
    };

    // Recalculate conversation's current vibe from all messages
    const allMessagesResult = await query(
      `SELECT id, content, vibe, user_id FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC;`,
      [conversationId]
    );
    const insights = calculateConversationInsights(allMessagesResult.rows);

    // Update conversation timestamp
    await query(
      `UPDATE conversations 
       SET updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1;`,
      [conversationId]
    );

    return res.status(201).json({
      success: true,
      message: fullMessage,
      vibe: detectedVibe,
      updatedConversationVibe: insights.currentVibe,
      insights,
    });
  } catch (err) {
    console.warn('Database write fallback in sendMessage:', err.message);

    // Graceful fallback: return the message with the analyzed vibe
    const fallbackMessage = {
      id: Date.now(),
      conversationId: Number(conversationId),
      userId: senderId,
      senderName: senderId === 1 ? 'Liam Vance' : 'Team Member',
      content: content.trim(),
      vibe: detectedVibe,
      createdAt: new Date().toISOString(),
      isSelf: senderId === 1,
    };

    if (!inMemoryMessages[conversationId]) inMemoryMessages[conversationId] = [];
    inMemoryMessages[conversationId].push(fallbackMessage);

    const insights = calculateConversationInsights(inMemoryMessages[conversationId]);

    return res.status(201).json({
      success: true,
      message: fallbackMessage,
      vibe: detectedVibe,
      updatedConversationVibe: insights.currentVibe,
      insights,
      source: 'in-memory-fallback',
    });
  }
};
