export const VIBE_KEYS = ['Positive', 'Neutral', 'Frustrated', 'Excited', 'Collaborative'];

// Multi-word phrases checked with high priority
const PRIORITY_PHRASES = {
  Excited: [
    "let's go", "lets go", "can't wait", "cant wait", "so excited", "blown away", "so hyped"
  ],
  Collaborative: [
    "work together", "working together", "we can", "let's", "lets", "how about", 
    "let's sync", "lets sync", "let's review", "lets review", "let's plan", "lets plan"
  ],
  Positive: [
    "thank you", "sounds good", "well done", "good job", "looks good", "great job"
  ],
  Frustrated: [
    "not working", "cant get", "can't get", "broken again", "so annoying"
  ]
};

// Word-level keyword dictionaries
const VIBE_KEYWORDS = {
  Positive: [
    'good', 'great', 'awesome', 'love', 'nice', 'excellent',
    'thanks', 'thx', 'happy', 'perfect', 'cool', 'solid', 'glad',
    'pleased', 'enjoy', 'appreciated', 'approved', 'wonderful', 'thumbs'
  ],
  Frustrated: [
    'angry', 'annoyed', 'terrible', 'frustrated', 'broken', 'ugh',
    'bug', 'bugs', 'stuck', 'fail', 'failed', 'failing', 'slow',
    'hate', 'issue', 'issues', 'crash', 'crashing', 'error', 'errors',
    'horrible', 'delay', 'delayed', 'blocker', 'blocked', 'terribly'
  ],
  Excited: [
    'amazing', 'wow', 'excited', 'fantastic',
    'yay', 'woohoo', 'congrats', 'congratulations', 'incredible',
    'unbelievable', 'hyped', 'milestone', 'thrilled', 'overjoyed', 'epic'
  ],
  Collaborative: [
    'together', 'plan', 'planning', 'team',
    'sync', 'review', 'coordinate', 'align', 'aligned', 'collaborate',
    'collaborating', 'discuss', 'discussing', 'brainstorm', 'merge', 'workflow'
  ]
};

// Helper: Escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Analyze message text and determine its conversation vibe
 * Categories: Positive, Neutral, Frustrated, Excited, Collaborative
 */
export function analyzeMessageVibe(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return 'Neutral';
  }

  const lower = text.toLowerCase();
  const scores = {
    Positive: 0,
    Frustrated: 0,
    Excited: 0,
    Collaborative: 0,
  };

  // 1. Check priority phrases first (higher weight: 3.5 points)
  for (const [vibe, phrases] of Object.entries(PRIORITY_PHRASES)) {
    for (const phrase of phrases) {
      if (lower.includes(phrase)) {
        scores[vibe] += 3.5;
      }
    }
  }

  // 2. Tokenize and test keyword matches with whole-word boundaries
  for (const [vibe, words] of Object.entries(VIBE_KEYWORDS)) {
    for (const word of words) {
      const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i');
      if (regex.test(lower)) {
        scores[vibe] += 2.0;
      }
    }
  }

  // 3. Emojis
  if (/[\u{1F389}\u{1F680}\u{1F525}]/u.test(text)) scores.Excited += 2.5; // 🎉 🚀 🔥
  if (/[\u{1F91D}]/u.test(text)) scores.Collaborative += 2.5;              // 🤝
  if (/[\u{1F60A}\u{1F44D}\u{2728}]/u.test(text)) scores.Positive += 2.0;  // 😊 👍 ✨
  if (/[\u{1F624}\u{1F621}\u{1F620}]/u.test(text)) scores.Frustrated += 2.5; // 😤 😡 😠

  // 4. Exclamation mark multiplier
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations > 0) {
    if (scores.Excited > 0) scores.Excited += Math.min(2.0, exclamations * 0.8);
    if (scores.Frustrated > 0) scores.Frustrated += Math.min(1.5, exclamations * 0.5);
  }

  // 5. Determine dominant vibe
  let highestScore = 0;
  let dominantVibe = 'Neutral';

  for (const [vibe, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      dominantVibe = vibe;
    }
  }

  // Must exceed minimal threshold to be non-neutral
  if (highestScore < 1.5) {
    return 'Neutral';
  }

  return dominantVibe;
}

/**
 * Extract action items (Tasks and Decisions) from a list of messages
 */
export function extractTasksAndDecisions(messages = []) {
  const tasks = [];
  const decisions = [];

  const decisionKeywords = ['decision:', 'decided', 'lock in', 'shipping', 'ship', 'target is', 'agreed to', 'confirmed'];
  const taskKeywords = ['todo:', 'task:', 'i will', 'will finalize', 'need to', 'action item:', 'assigned', 'review'];

  messages.forEach((msg) => {
    const text = msg.content || '';
    const lower = text.toLowerCase();

    const hasDecision = decisionKeywords.some((kw) => lower.includes(kw));
    if (hasDecision) {
      decisions.push({
        id: `dec-${msg.id}`,
        title: text.length > 60 ? text.slice(0, 60) + '...' : text,
        timestamp: msg.timestamp || msg.created_at || 'Recent',
        author: msg.sender_name || msg.senderName || 'Team',
      });
    }

    const hasTask = taskKeywords.some((kw) => lower.includes(kw));
    if (hasTask) {
      tasks.push({
        id: `task-${msg.id}`,
        title: text.length > 60 ? text.slice(0, 60) + '...' : text,
        assignee: msg.sender_name || msg.senderName || 'Unassigned',
        assigneeAvatar: msg.avatar_url || msg.avatar,
        due: lower.includes('today') || lower.includes('pm') ? 'Due Today' : 'Due Soon',
      });
    }
  });

  return { tasks, decisions };
}

/**
 * Compute aggregate conversation insights
 */
export function calculateConversationInsights(messages = []) {
  const total = messages.length;
  if (total === 0) {
    return {
      currentVibe: 'Neutral',
      overallMood: 'Balanced & Steady',
      stabilityIndex: 80,
      messageCount: 0,
      participantCount: 0,
      breakdown: {
        Collaborative: 20,
        Excited: 20,
        Positive: 20,
        Neutral: 20,
        Frustrated: 20,
      },
      tasks: [],
      decisions: [],
    };
  }

  const counts = {
    Collaborative: 0,
    Excited: 0,
    Positive: 0,
    Neutral: 0,
    Frustrated: 0,
  };

  const participants = new Set();

  messages.forEach((msg) => {
    const sender = msg.sender_id || msg.senderId || msg.sender_name || msg.user_id || 'anon';
    participants.add(sender);
    const v = msg.vibe && counts[msg.vibe] !== undefined ? msg.vibe : 'Neutral';
    counts[v] += 1;
  });

  const breakdown = {};
  let totalPerc = 0;
  VIBE_KEYS.forEach((key, idx) => {
    if (idx === VIBE_KEYS.length - 1) {
      breakdown[key] = Math.max(0, 100 - totalPerc);
    } else {
      const p = Math.round((counts[key] / total) * 100);
      breakdown[key] = p;
      totalPerc += p;
    }
  });

  // Recent weighted vibe
  const recentMessages = messages.slice(-5);
  const recentCounts = { ...counts };
  recentMessages.forEach((msg) => {
    if (msg.vibe) recentCounts[msg.vibe] += 2;
  });

  let currentVibe = 'Neutral';
  let highestCount = -1;
  VIBE_KEYS.forEach((key) => {
    if (recentCounts[key] > highestCount) {
      highestCount = recentCounts[key];
      currentVibe = key;
    }
  });

  const topPercentage = breakdown[currentVibe] || 50;
  const stabilityIndex = Math.min(99, Math.max(68, topPercentage + 15));
  const { tasks, decisions } = extractTasksAndDecisions(messages);

  const moodDescriptions = {
    Collaborative: 'High Alignment & Team Synergy',
    Excited: 'Electric & Breakthrough Momentum',
    Positive: 'Constructive & Supportive Atmosphere',
    Neutral: 'Calm & Focused Telemetry',
    Frustrated: 'Impediments & Blockers Reported',
  };

  return {
    currentVibe,
    overallMood: moodDescriptions[currentVibe] || 'Active Discussion',
    stabilityIndex,
    messageCount: total,
    participantCount: Math.max(1, participants.size),
    breakdown,
    tasks,
    decisions,
  };
}
