import React, { useState } from 'react';
import { VIBES, VIBE_KEYS } from '../constants/vibes';

export default function NewConversationModal({ isOpen, onClose, onCreateConversation }) {
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [initialVibe, setInitialVibe] = useState('Collaborative');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateConversation({
      title: title.trim(),
      channel: channel.trim() ? (channel.startsWith('#') ? channel : `#${channel}`) : `#${title.toLowerCase().replace(/\s+/g, '-')}`,
      initialVibe,
    });

    setTitle('');
    setChannel('');
    setInitialVibe('Collaborative');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container border border-outline-variant/40 rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary-container to-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[20px]">add_comment</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              New Conversation
            </h3>
            <p className="text-xs text-on-surface-variant">
              Create a discussion room with real-time sentiment telemetry
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Conversation Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q1 Growth Strategy Sync"
              className="w-full px-3.5 py-2.5 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 rounded-xl text-sm border border-outline-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Channel Handle (Optional)
            </label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="#growth-strategy"
              className="w-full px-3.5 py-2.5 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 rounded-xl text-sm border border-outline-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Initial Target Vibe
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VIBE_KEYS.map((key) => {
                const meta = VIBES[key];
                const isSelected = initialVibe === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setInitialVibe(key)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? `${meta.badgeClass} ring-1 ring-primary/40 shadow-sm`
                        : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>{meta.emoji}</span>
                    <span>{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-outline-variant/20 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-primary text-on-primary font-semibold text-xs shadow-md shadow-primary/20 hover:brightness-105 active:scale-95 transition-all"
            >
              Create Conversation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
