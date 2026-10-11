import React, { useState } from 'react';

import { VIBES } from '../constants/vibes';
import VibeSelector from './VibeSelector';

export default function MessageComposer({ onSendMessage }) {
  const [content, setContent] = useState('');
  const [selectedVibe, setSelectedVibe] = useState(null);

  // Real-time sentiment prediction preview as the user types
  // No automatic vibe prediction for sending. User must explicitly select a vibe.
  const activeVibeKey = selectedVibe;
  const vibeMeta = selectedVibe ? VIBES[selectedVibe] : null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    onSendMessage({
      content: content.trim(),
      vibe: activeVibeKey,
    });

    setContent('');
    setSelectedVibe(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickEmojis = ['🤝', '🎉', '😊', '😤', '👍', '🚀'];

  return (
    <div className="p-4 pt-2 bg-gradient-to-t from-background via-background to-transparent shrink-0">
      <div className="rounded-2xl bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/40 p-3 shadow-2xl focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        {/* Input field row */}
        <div className="w-full">
          <VibeSelector selectedVibe={selectedVibe} onSelect={setSelectedVibe} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={2}
            className="w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/60 focus:ring-0 focus:outline-none resize-none text-sm p-0 leading-relaxed"
          />
        </div>

        {/* Bottom bar within composer */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-outline-variant/20 mt-1 gap-2">
          {/* Left formatting & emoji tools */}
          <div className="flex items-center gap-1 text-on-surface-variant">
            <button
              type="button"
              className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
              title="Formatting (Bold)"
            >
              <span className="material-symbols-outlined text-[18px]">format_bold</span>
            </button>
            <button
              type="button"
              className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
              title="Attach File"
            >
              <span className="material-symbols-outlined text-[18px]">attach_file</span>
            </button>
            <button
              type="button"
              className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
              title="Emoji Picker"
            >
              <span className="material-symbols-outlined text-[18px]">sentiment_satisfied</span>
            </button>
            <button
              type="button"
              className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
              title="Mention Team Member"
            >
              <span className="material-symbols-outlined text-[18px]">alternate_email</span>
            </button>

            {/* Quick emoji injection pills */}
            <div className="hidden md:flex items-center gap-1 ml-2 pl-2 border-l border-outline-variant/25">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setContent((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + emoji)}
                  className="hover:scale-125 transition-transform text-sm px-1 py-0.5 rounded hover:bg-surface-container"
                  title={`Insert ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Live Vibe Prediction Badge & Send Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            {/* Selected vibe badge */}
            {selectedVibe && vibeMeta && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${vibeMeta.badgeClass}`}
                title={`Selected vibe: ${activeVibeKey}`}
              >
                <span className={`w-2 h-2 rounded-full ${vibeMeta.dotClass}`}></span>
                <span className="text-[11px] text-on-surface-variant hidden sm:inline">Vibe:</span>
                <span className="text-[11px] font-bold">
                  {vibeMeta.emoji} {vibeMeta.label}
                </span>
              </div>
            )}

            {/* Circular Send Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!content.trim() || !selectedVibe}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
                content.trim()
                  ? 'bg-gradient-to-r from-primary-container to-primary text-on-primary hover:scale-105 active:scale-95 shadow-primary/20 cursor-pointer'
                  : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'
              }`}
              title="Send Message (Enter)"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                arrow_upward
              </span>
            </button>
            {/* Inline warning when no vibe selected */}
            {!selectedVibe && (
              <span className="text-[11px] text-error-variant" role="alert">
                Please select a vibe before sending.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
