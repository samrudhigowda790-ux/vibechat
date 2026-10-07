-- ============================================================================
-- VibeChat Schema for Aiven PostgreSQL
-- Tables: users, conversations, conversation_members, messages
-- ============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Conversation Members Table
CREATE TABLE IF NOT EXISTS conversation_members (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (conversation_id, user_id)
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    vibe VARCHAR(30) DEFAULT 'Neutral',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conv_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ============================================================================
-- Seed Initial Users & Demo Data
-- ============================================================================
INSERT INTO users (id, name, email)
VALUES 
  (1, 'Liam Vance', 'liam@vibechat.io'),
  (2, 'Elena Rostova', 'elena@vibechat.io'),
  (3, 'Samrudhi Patel', 'samrudhi@vibechat.io'),
  (4, 'Alex Rivera', 'alex@vibechat.io')
ON CONFLICT (email) DO NOTHING;

INSERT INTO conversations (id, title)
VALUES 
  (1, 'Q4 Product Roadmap & Sprint Sync'),
  (2, 'Feature Launch Celebration 🎉'),
  (3, 'Server Incident Response 😤'),
  (4, 'Weekly Design Sync 😊'),
  (5, 'General Watercooler 😐')
ON CONFLICT (id) DO NOTHING;

-- Seed conversation members
INSERT INTO conversation_members (conversation_id, user_id)
VALUES 
  (1, 1), (1, 2), (1, 3), (1, 4),
  (2, 2), (2, 4),
  (3, 3),
  (4, 1),
  (5, 4)
ON CONFLICT DO NOTHING;

-- Seed initial conversation messages
INSERT INTO messages (conversation_id, user_id, content, vibe)
VALUES
  (1, 2, 'Good morning team! We need to lock in the Q4 launch dates today. Target is shipping v1 beta by end of this week. Are we on track?', 'Collaborative'),
  (1, 3, 'Postgres schema migrations are 90% ready. I will finalize PostgreSQL schema indexing by 2 PM so Alex can run the frontend load benchmarks.', 'Positive'),
  (1, 4, 'Component library is feeling super fast. Just merged the new sentiment analysis streaming hooks into staging. The live telemetry updates seamlessly!', 'Excited'),
  (1, 1, 'Inspecting the design tokens now. Typography rhythm and glassmorphism contrast meet all accessibility specs. Let’s do a quick sync before code freeze.', 'Collaborative')
ON CONFLICT DO NOTHING;
