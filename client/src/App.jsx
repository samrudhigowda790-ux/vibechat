import React, { useState, useMemo, useEffect } from 'react';
import TopNavBar from './components/TopNavBar';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageComposer from './components/MessageComposer';
import InsightsPanel from './components/InsightsPanel';
import NewConversationModal from './components/NewConversationModal';
import { INITIAL_CONVERSATIONS, CURRENT_USER } from './data/mockConversations';
import { calculateConversationInsights } from './utils/vibeAnalyzer';
import { api } from './services/api';

export default function App() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState('conv-1');
  const [activeTab, setActiveTab] = useState('All Activity');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Checking backend...' });

  // Check backend health & sync conversations on mount
  useEffect(() => {
    async function initBackend() {
      const health = await api.checkHealth();
      if (health && health.status === 'ok') {
        setBackendStatus({
          connected: true,
          dbConnected: health.database?.connected,
          message: health.database?.connected ? 'Aiven PostgreSQL Online' : 'Backend Ready (DB Pending Password)',
        });

        // Attempt to fetch conversations from backend
        const convsRes = await api.getConversations();
        if (convsRes && convsRes.success && convsRes.conversations && convsRes.conversations.length > 0) {
          // Merge with initial data
          setConversations((prev) => {
            const backendMap = new Map(convsRes.conversations.map((c) => [String(c.id), c]));
            return prev.map((p) => {
              const numId = p.id.replace('conv-', '');
              const b = backendMap.get(numId);
              if (b) {
                return {
                  ...p,
                  currentVibe: b.currentVibe || p.currentVibe,
                  timeAgo: b.updatedAt ? 'Active' : p.timeAgo,
                };
              }
              return p;
            });
          });
        }
      } else {
        setBackendStatus({ connected: false, message: 'Backend Offline (Using Local State)' });
      }
    }
    initBackend();
  }, []);

  // Active conversation object
  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeConversationId) ||
      conversations[0] ||
      null
    );
  }, [conversations, activeConversationId]);

  // Dynamically compute live conversation insights
  const liveInsights = useMemo(() => {
    if (!activeConversation) return null;
    return calculateConversationInsights(activeConversation.messages || []);
  }, [activeConversation]);

  // Handle sending a new message
  const handleSendMessage = async ({ content, vibe }) => {
    if (!activeConversation) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      role: CURRENT_USER.role,
      avatar: CURRENT_USER.avatar,
      content,
      vibe: vibe || 'Neutral',
      timestamp: timeString,
      isSelf: true,
      reactions: [],
    };

    // Optimistically update frontend UI immediately
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeConversationId) return conv;

        const updatedMessages = [...(conv.messages || []), newMessage];
        const newInsights = calculateConversationInsights(updatedMessages);

        return {
          ...conv,
          messages: updatedMessages,
          currentVibe: newInsights.currentVibe,
          timeAgo: 'Just now',
        };
      })
    );

    // Call backend API in background to persist to PostgreSQL & run backend vibe engine
    const numericConvId = activeConversationId.replace('conv-', '') || 1;
    await api.sendMessage(numericConvId, {
      content,
      vibe,
      userId: 1,
    });
  };

  // Handle adding/incrementing reactions
  const handleAddReaction = (messageId, emoji) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeConversationId) return conv;

        const updatedMessages = (conv.messages || []).map((msg) => {
          if (msg.id !== messageId) return msg;

          const existingReaction = (msg.reactions || []).find((r) => r.emoji === emoji);
          let newReactions;
          if (existingReaction) {
            newReactions = msg.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            );
          } else {
            newReactions = [...(msg.reactions || []), { emoji, count: 1 }];
          }

          return { ...msg, reactions: newReactions };
        });

        return { ...conv, messages: updatedMessages };
      })
    );
  };

  // Handle creating a new conversation
  const handleCreateConversation = async ({ title, channel, initialVibe }) => {
    const newConvId = `conv-${Date.now()}`;
    const newConv = {
      id: newConvId,
      title,
      channel: channel || `#${title.toLowerCase().replace(/\s+/g, '-')}`,
      currentVibe: initialVibe || 'Collaborative',
      timeAgo: 'Just now',
      unreadCount: 0,
      tags: ['Discussion'],
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          senderId: CURRENT_USER.id,
          senderName: CURRENT_USER.name,
          role: CURRENT_USER.role,
          avatar: CURRENT_USER.avatar,
          content: `Started new conversation: "${title}". Initial target vibe set to ${initialVibe}.`,
          vibe: initialVibe || 'Collaborative',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSelf: true,
          reactions: [{ emoji: '🎉', count: 1 }],
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);

    // Persist to backend API
    await api.createConversation({
      title,
      channel,
      initialVibe,
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-on-surface">
      {/* Layer 1: Top Navigation Bar */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
        onToggleInsights={() => setIsInsightsOpen((prev) => !prev)}
        isInsightsOpen={isInsightsOpen}
      />

      {/* Layer 2: Main 3-Column Studio Workspace */}
      <main className="flex flex-1 w-full overflow-hidden relative">
        {/* Column 1: Left Sidebar (Conversations & Navigation) */}
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onOpenNewChatModal={() => setIsNewChatModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isOpenOnMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Column 2: Center Main Chat Stream */}
        <section className="flex-1 flex flex-col bg-background relative overflow-hidden h-[calc(100vh-4rem)]">
          {activeConversation ? (
            <>
              {/* Active Chat Header with Prominent Live Vibe Badge */}
              <ChatHeader
                conversation={activeConversation}
                onToggleInsights={() => setIsInsightsOpen((prev) => !prev)}
                isInsightsOpen={isInsightsOpen}
              />

              {/* Message Feed */}
              <MessageList
                messages={activeConversation.messages || []}
                onAddReaction={handleAddReaction}
              />

              {/* Message Composer with Live Predictive Vibe */}
              <MessageComposer onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant">
              Select or create a conversation to begin.
            </div>
          )}
        </section>

        {/* Column 3: Right Panel (Conversation Insights Telemetry) */}
        <InsightsPanel
          insights={liveInsights}
          isOpen={isInsightsOpen}
          onClose={() => setIsInsightsOpen(false)}
        />
      </main>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
}
