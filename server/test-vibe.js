import { analyzeMessageVibe, calculateConversationInsights, VIBE_KEYS } from './src/utils/vibeAnalyzer.js';

console.log('====================================================');
console.log('🧪 RUNNING VIBECHAT VIBE ANALYZER TEST SUITE');
console.log('====================================================\n');

let passedCount = 0;
let totalCount = 0;

function assertVibe(text, expectedVibe) {
  totalCount++;
  const detected = analyzeMessageVibe(text);
  const passed = detected === expectedVibe;
  if (passed) {
    passedCount++;
    console.log(`✅ [PASS] "${text}" -> Detected: ${detected}`);
  } else {
    console.error(`❌ [FAIL] "${text}" -> Expected: ${expectedVibe}, but got: ${detected}`);
  }
}

// 1. Positive Tests (User examples: "good", "great", "awesome", "love", "nice", "excellent")
console.log('--- 1. Testing Positive Category ---');
assertVibe('This is a really good idea', 'Positive');
assertVibe('Great job on the presentation', 'Positive');
assertVibe('Awesome news, we love this feature', 'Positive');
assertVibe('Nice and excellent work team', 'Positive');
assertVibe('Thank you so much, looks good', 'Positive');

// 2. Frustrated Tests (User examples: "angry", "annoyed", "terrible", "frustrated", "broken", "ugh")
console.log('\n--- 2. Testing Frustrated Category ---');
assertVibe('I am so angry that the build failed', 'Frustrated');
assertVibe('Really annoyed by this recurring error', 'Frustrated');
assertVibe('The database latency is terrible today', 'Frustrated');
assertVibe('I feel so frustrated with this blocker', 'Frustrated');
assertVibe('The staging server is broken again, ugh!', 'Frustrated');

// 3. Excited Tests (User examples: "amazing", "wow", "excited", "fantastic", "let\'s go")
console.log('\n--- 3. Testing Excited Category ---');
assertVibe('This new release is truly amazing!', 'Excited');
assertVibe('Wow, we hit our quarterly milestone already!', 'Excited');
assertVibe('I am so excited for the public launch', 'Excited');
assertVibe('Fantastic turnout at the demo', 'Excited');
assertVibe("All tests passing, let's go! 🚀", 'Excited');

// 4. Collaborative Tests (User examples: "let\'s", "together", "we can", "plan", "team", "work together")
console.log('\n--- 4. Testing Collaborative Category ---');
assertVibe("Let's coordinate on the sprint schedule", 'Collaborative');
assertVibe('We can build this feature together as a team', 'Collaborative');
assertVibe('We can work together to finish the migration', 'Collaborative');
assertVibe("Let's plan the architecture review for tomorrow", 'Collaborative');
assertVibe('Let’s sync up to review the schema', 'Collaborative');

// 5. Neutral Tests (Non-emotional informational messages)
console.log('\n--- 5. Testing Neutral Category ---');
assertVibe('The meeting is scheduled at 2 PM in Room 4', 'Neutral');
assertVibe('Please check page 12 of the API documentation', 'Neutral');
assertVibe('The database port is 24078 on the remote host', 'Neutral');
assertVibe('The server was started with Node version 24', 'Neutral');

// 6. Insights Calculation Test
console.log('\n--- 6. Testing Conversation Insights Aggregation ---');
const sampleMessages = [
  { id: 1, content: "Let's work together to ship this", vibe: 'Collaborative', user_id: 1 },
  { id: 2, content: "Great work everyone, awesome progress", vibe: 'Positive', user_id: 2 },
  { id: 3, content: "Amazing launch! Wow! 🎉", vibe: 'Excited', user_id: 3 },
  { id: 4, content: "Database issue is broken and terrible, ugh", vibe: 'Frustrated', user_id: 1 },
  { id: 5, content: "The config file is located at /etc/app", vibe: 'Neutral', user_id: 4 },
  { id: 6, content: "TODO: Samrudhi to index tables", vibe: 'Collaborative', user_id: 2 },
  { id: 7, content: "Decision: Launch beta on Friday", vibe: 'Positive', user_id: 3 },
];

const insights = calculateConversationInsights(sampleMessages);
totalCount++;
if (
  insights.currentVibe &&
  insights.messageCount === 7 &&
  insights.tasks.length > 0 &&
  insights.decisions.length > 0 &&
  VIBE_KEYS.every(k => typeof insights.breakdown[k] === 'number')
) {
  passedCount++;
  console.log(`✅ [PASS] Insights aggregation: Message count: ${insights.messageCount}, Vibe: ${insights.currentVibe}, Mood: "${insights.overallMood}"`);
  console.log('   Breakdown:', JSON.stringify(insights.breakdown));
  console.log('   Detected Tasks:', insights.tasks.length, '| Decisions:', insights.decisions.length);
} else {
  console.error('❌ [FAIL] Insights calculation did not match expected structure');
}

console.log('\n====================================================');
console.log(`📊 TEST RESULTS: ${passedCount}/${totalCount} tests passed (${Math.round((passedCount/totalCount)*100)}%)`);
console.log('====================================================');

if (passedCount === totalCount) {
  process.exit(0);
} else {
  process.exit(1);
}
