import React, { useEffect, useRef } from 'react';
import { VIBES } from '../constants/vibes';

export default function MessageList({ messages = [], onAddReaction }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Date Separator */}
      <div className="flex items-center justify-center my-2">
        <div className="h-px bg-outline-variant/30 flex-1"></div>
        <span className="px-4 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">
          Today, October 24
        </span>
        <div className="h-px bg-outline-variant/30 flex-1"></div>
      </div>

      {messages.map((msg) => {
        const isSelf = !!msg.isSelf;
        const vibeMeta = VIBES[msg.vibe] || VIBES.Neutral;

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 group ${isSelf ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar with corner sentiment badge */}
            <div className="relative shrink-0 mt-0.5">
              <img
                className={`w-10 h-10 rounded-xl object-cover ${
                  isSelf ? 'ring-2 ring-primary/60' : 'ring-1 ring-outline-variant/40'
                }`}
                src={msg.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={msg.senderName}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-surface-container-high border border-outline-variant/50 rounded-full flex items-center justify-center text-[9px] shadow-sm">
                {vibeMeta.emoji}
              </span>
            </div>

            {/* Message Body & Container */}
            <div className={`flex-1 max-w-2xl ${isSelf ? 'flex flex-col items-end' : ''}`}>
              {/* Header meta */}
              <div
                className={`flex items-baseline gap-2 mb-1.5 ${
                  isSelf ? 'flex-row-reverse' : ''
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    isSelf ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  {msg.senderName}
                </span>

                {msg.role && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isSelf
                        ? 'bg-primary-container/20 text-primary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {msg.role}
                  </span>
                )}

                <span className="text-[11px] font-mono text-on-surface-variant/60">
                  {msg.timestamp || 'Just now'}
                </span>

                {!isSelf && (
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-on-surface cursor-pointer text-xs">
                    Reply
                  </span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm text-left ${
                  isSelf
                    ? 'rounded-tr-sm bg-gradient-to-br from-primary-container/20 to-surface-container border border-primary/40 text-on-surface shadow-md'
                    : 'rounded-tl-sm bg-surface-container-low border border-outline-variant/30 text-on-surface'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Optional code attachment */}
                {msg.attachment && (
                  <div className="flex items-center justify-between p-2 mt-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 transition-colors cursor-pointer group/pill max-w-md">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-secondary-container/30 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[16px]">code</span>
                      </div>
                      <div className="truncate">
                        <div className="text-[11px] font-mono font-medium text-on-surface group-hover/pill:text-primary transition-colors truncate">
                          {msg.attachment.name}
                        </div>
                        <div className="text-[10px] text-on-surface-variant font-mono">
                          {msg.attachment.meta}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] pr-1">
                      download
                    </span>
                  </div>
                )}
              </div>

              {/* Footer Sentiment Tag & Reactions */}
              <div
                className={`flex items-center gap-2 mt-1.5 ${
                  isSelf ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Sentiment Pill Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${vibeMeta.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${vibeMeta.dotClass}`}></span>
                  <span>{vibeMeta.emoji} {vibeMeta.label}</span>
                </span>

                {/* Reactions list */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {msg.reactions.map((react, i) => (
                      <button
                        key={i}
                        onClick={() => onAddReaction && onAddReaction(msg.id, react.emoji)}
                        className="px-2 py-0.5 rounded-full bg-surface-container-high hover:bg-surface-variant border border-outline-variant/30 text-[11px] font-medium text-on-surface flex items-center gap-1 transition-colors"
                      >
                        <span>{react.emoji}</span>
                        <span>{react.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Self Read Receipt */}
                {isSelf && (
                  <span
                    className="material-symbols-outlined text-[15px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    title="Delivered & Read"
                  >
                    done_all
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
