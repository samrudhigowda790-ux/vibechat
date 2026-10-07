import React, { useState } from 'react';
import { CURRENT_USER } from '../data/mockConversations';
import { VIBES } from '../constants/vibes';

export default function Sidebar({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onOpenNewChatModal,
  searchQuery,
  setSearchQuery,
  isOpenOnMobile,
  onCloseMobile,
}) {
  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.currentVibe.toLowerCase().includes(q) ||
      (c.messages && c.messages.some((m) => m.content.toLowerCase().includes(q)))
    );
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-[280px] bg-surface-container-low border-r border-outline-variant/30 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col p-3 pb-0 space-y-3">
          {/* User Profile Chip */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container/60 border border-outline-variant/20 hover:border-outline-variant/40 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <img
                  className="w-9 h-9 rounded-lg object-cover ring-1 ring-outline-variant"
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.displayName}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-surface-container"></span>
              </div>
              <div className="truncate">
                <div className="font-semibold text-sm text-on-surface truncate">
                  {CURRENT_USER.displayName}
                </div>
                <div className="text-[11px] text-on-surface-variant tracking-tight truncate">
                  {CURRENT_USER.status}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-on-surface-variant">
              <button className="p-1 hover:text-on-surface transition-colors rounded" title="Audio">
                <span className="material-symbols-outlined text-[17px]">mic</span>
              </button>
              <button className="p-1 hover:text-on-surface transition-colors rounded" title="Settings">
                <span className="material-symbols-outlined text-[17px]">settings</span>
              </button>
            </div>
          </div>

          {/* Primary CTA: + New Conversation */}
          <button
            onClick={onOpenNewChatModal}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary-container via-surface-tint to-primary text-on-primary-fixed text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:brightness-105 transition-all duration-150 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ New Conversation</span>
          </button>

          {/* Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[17px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations or vibes..."
              className="w-full pl-9 pr-11 py-2 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 rounded-xl text-xs border border-outline-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
            />
            <kbd className="absolute right-2.5 top-2.5 px-1.5 py-0.5 text-[10px] bg-surface-container-high rounded text-on-surface-variant font-mono border border-outline-variant/30">
              ⌘K
            </kbd>
          </div>

          {/* Section Label */}
          <div className="flex items-center justify-between px-1 pt-2">
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant/70 font-bold">
              CONVERSATIONS ({filteredConversations.length})
            </span>
            <button className="text-on-surface-variant hover:text-on-surface p-0.5" title="Sort">
              <span className="material-symbols-outlined text-[15px]">sort</span>
            </button>
          </div>
        </div>

        {/* Scrollable Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1.5 mt-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant/60 text-xs">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const vibeMeta = VIBES[conv.currentVibe] || VIBES.Neutral;
              const lastMessage = conv.messages && conv.messages[conv.messages.length - 1];
              const preview = lastMessage
                ? `${lastMessage.senderName.split(' ')[0]}: ${lastMessage.content}`
                : 'No messages yet';

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all duration-150 relative ${
                    isActive
                      ? 'bg-surface-container-high/90 border border-primary/50 shadow-sm'
                      : 'hover:bg-surface-container/60 border border-transparent hover:border-outline-variant/20'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <h4
                      className={`text-sm truncate leading-tight font-semibold ${
                        isActive ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {conv.title}
                    </h4>
                    <span
                      className={`text-[10px] font-mono shrink-0 ${
                        isActive ? 'text-primary/90' : 'text-on-surface-variant/70'
                      }`}
                    >
                      {conv.timeAgo || 'Just now'}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant/80 truncate mt-1">
                    {preview}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-outline-variant/15">
                    {/* Mini Vibe Indicator Tag */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${vibeMeta.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${vibeMeta.dotClass} ${isActive ? 'animate-pulse' : ''}`}></span>
                      <span>{vibeMeta.emoji} {vibeMeta.label}</span>
                    </span>

                    {/* Unread count or member count */}
                    {conv.unreadCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-primary text-on-primary font-bold text-[10px]">
                        {conv.unreadCount}
                      </span>
                    ) : (
                      <div className="flex -space-x-1">
                        <span className="w-4 h-4 rounded-full bg-surface-container-highest border border-surface-container-low text-[8px] flex items-center justify-center font-bold text-on-surface-variant">
                          {conv.messages ? new Set(conv.messages.map((m) => m.senderId)).size : 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Docked Footer */}
        <div className="p-3 border-t border-outline-variant/20 bg-surface-container-lowest/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[11px] text-on-surface-variant tracking-wider uppercase font-semibold">
              Live Telemetry Active
            </span>
          </div>
          <span className="text-[11px] font-mono text-primary font-bold">99.8% Resonance</span>
        </div>
      </aside>
    </>
  );
}
