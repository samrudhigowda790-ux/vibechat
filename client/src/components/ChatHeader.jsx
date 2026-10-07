import React from 'react';
import { VIBES } from '../constants/vibes';

export default function ChatHeader({
  conversation,
  onToggleInsights,
  isInsightsOpen,
}) {
  if (!conversation) return null;

  const currentVibeKey = conversation.currentVibe || 'Neutral';
  const vibeMeta = VIBES[currentVibeKey] || VIBES.Neutral;

  // Extract distinct member avatars
  const distinctSenders = [];
  const seenSenders = new Set();
  (conversation.messages || []).forEach((m) => {
    if (m.senderId && !seenSenders.has(m.senderId)) {
      seenSenders.add(m.senderId);
      distinctSenders.push({
        name: m.senderName,
        avatar: m.avatar,
      });
    }
  });

  return (
    <div className="h-16 px-4 lg:px-6 bg-surface-container-lowest/60 backdrop-blur-md border-b border-outline-variant/20 flex items-center justify-between shrink-0 z-10">
      {/* Left: Channel Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/30 text-primary shrink-0">
          <span className="material-symbols-outlined text-[20px]">tag</span>
        </div>
        <div className="truncate">
          <div className="flex items-center gap-2">
            <h2 className="font-headline font-bold text-base lg:text-lg text-on-surface tracking-tight truncate">
              {conversation.title}
            </h2>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px] shrink-0">
              lock
            </span>
          </div>
          <p className="text-xs text-on-surface-variant/80 flex items-center gap-2 truncate">
            <span>{Math.max(1, distinctSenders.length)} active members</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span className="text-primary truncate hidden sm:inline">
              Connected to GitHub & Linear
            </span>
          </p>
        </div>
      </div>

      {/* Center/Right: Live Conversation Vibe Pill & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Prominent Live Conversation Vibe Pill */}
        <div
          className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-surface-container-high/90 border transition-all duration-300 ${vibeMeta.badgeClass} ${vibeMeta.glowClass}`}
          title={`Current conversation vibe: ${vibeMeta.label}`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${vibeMeta.dotClass}`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${vibeMeta.dotClass}`}
            ></span>
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-on-surface-variant font-medium hidden md:inline">
            Conversation Vibe:
          </span>
          <span className="text-xs sm:text-sm font-bold flex items-center gap-1">
            <span>{vibeMeta.emoji}</span>
            <span>{vibeMeta.label}</span>
          </span>
        </div>

        {/* Participant Avatar Cluster */}
        <div className="hidden sm:flex items-center -space-x-2 pl-1">
          {distinctSenders.slice(0, 3).map((sender, idx) => (
            <img
              key={idx}
              className="w-7 h-7 rounded-full border-2 border-background object-cover"
              src={sender.avatar}
              alt={sender.name}
              title={sender.name}
            />
          ))}
          {distinctSenders.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-surface-container-highest border-2 border-background flex items-center justify-center text-[10px] font-bold text-on-surface font-mono">
              +{distinctSenders.length - 3}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-outline-variant/30 mx-0.5 hidden sm:block"></div>

        {/* Action Controls */}
        <div className="flex items-center gap-0.5 text-on-surface-variant">
          <button
            className="p-1.5 sm:p-2 rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-colors hidden sm:inline-flex"
            title="Search inside thread"
          >
            <span className="material-symbols-outlined text-[19px]">search</span>
          </button>
          <button
            className="p-1.5 sm:p-2 rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-colors hidden md:inline-flex"
            title="Audio Call"
          >
            <span className="material-symbols-outlined text-[19px]">call</span>
          </button>
          <button
            className="p-1.5 sm:p-2 rounded-lg hover:bg-surface-container-high text-primary transition-colors hidden md:inline-flex"
            title="Video Call"
          >
            <span className="material-symbols-outlined text-[19px]">videocam</span>
          </button>
          <button
            onClick={onToggleInsights}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors xl:hidden ${
              isInsightsOpen
                ? 'bg-primary-container/25 text-primary'
                : 'hover:bg-surface-container-high hover:text-on-surface'
            }`}
            title="Toggle Conversation Insights"
          >
            <span className="material-symbols-outlined text-[19px]">monitoring</span>
          </button>
        </div>
      </div>
    </div>
  );
}
