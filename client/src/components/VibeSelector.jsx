import React from 'react';
import { VIBES, VIBE_KEYS } from '../constants/vibes';

/**
 * Compact selector for message vibe.
 * Displays the list of available vibes as clickable chips.
 * Highlights the currently selected vibe.
 * On small screens the list scrolls horizontally.
 */
export default function VibeSelector({ selectedVibe, onSelect }) {
  const placeholder = {
    key: 'placeholder',
    label: 'Choose a vibe',
    emoji: '➕',
    badgeClass: 'bg-surface-variant/20 border-dashed border-outline-variant/30 text-on-surface-variant',
    dotClass: 'bg-transparent',
  };

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 -mb-1" role="group" aria-label="Message vibe selector">
      {/* Placeholder chip – appears only when nothing is selected */}
      {!selectedVibe && (
        <button
          type="button"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${placeholder.badgeClass} cursor-default`}
          disabled
        >
          <span className="text-[12px]">{placeholder.emoji}</span>
          <span className="text-[11px] font-medium">{placeholder.label}</span>
        </button>
      )}

      {VIBE_KEYS.map((key) => {
        const meta = VIBES[key];
        const isActive = selectedVibe === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${
              isActive ? `${meta.badgeClass} ring-2 ring-primary/30` : 'bg-surface-variant/20 border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant/40'
            }`}
            onClick={() => onSelect(key)}
          >
            <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
            <span className="text-[12px]">{meta.emoji}</span>
            <span className="text-[11px] font-medium">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
