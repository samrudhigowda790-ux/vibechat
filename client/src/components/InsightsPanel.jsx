import React from 'react';
import { VIBES, VIBE_KEYS } from '../constants/vibes';

export default function InsightsPanel({
  insights,
  isOpen,
  onClose,
}) {
  if (!insights) return null;

  const {
    currentVibe = 'Neutral',
    stabilityIndex = 85,
    messageCount = 0,
    participantCount = 1,
    breakdown = {},
    tasks = [],
    decisions = [],
  } = insights;

  const currentVibeMeta = VIBES[currentVibe] || VIBES.Neutral;

  return (
    <>
      {/* Mobile/Tablet Backdrop when opened on smaller screens */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
        />
      )}

      <aside
        className={`fixed xl:static top-16 bottom-0 right-0 z-40 w-[320px] bg-surface-container-low border-l border-outline-variant/30 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              monitoring
            </span>
            <h3 className="font-headline font-bold text-base text-on-surface tracking-tight">
              Conversation Insights
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
            title="Collapse Panel"
          >
            <span className="material-symbols-outlined text-[18px]">
              dock_to_right
            </span>
          </button>
        </div>

        {/* Scrollable Main Insights Content */}
        <div className="p-4 space-y-5 flex-1 overflow-y-auto">
          {/* Hero Card: Current Vibe */}
          <div
            className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-primary-container/20 via-surface-container to-surface-container-high border transition-all duration-300 ${currentVibeMeta.badgeClass} ${currentVibeMeta.glowClass}`}
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                CURRENT OVERALL VIBE
              </span>
              <span className="flex h-2 w-2 relative">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentVibeMeta.dotClass}`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${currentVibeMeta.dotClass}`}
                ></span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 my-2">
              <div className="text-3xl">{currentVibeMeta.emoji}</div>
              <div>
                <div className="font-headline font-extrabold text-lg text-primary">
                  {currentVibeMeta.label}
                </div>
                <div className="text-[11px] font-mono text-primary/80">
                  {stabilityIndex}% Stability Index
                </div>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant/90 leading-relaxed mt-2 pt-2 border-t border-outline-variant/30">
              {currentVibeMeta.description}
            </p>

            {/* Micro Pulse Wave Canvas / Graphic */}
            <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant font-mono text-[10px]">
              <span>START</span>
              <div className="flex items-end gap-1 h-5 px-2">
                <span className="w-1 h-2 bg-primary/40 rounded-full"></span>
                <span className="w-1 h-3 bg-primary/60 rounded-full"></span>
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                <span className="w-1 h-5 bg-primary rounded-full animate-pulse"></span>
                <span className="w-1 h-3 bg-secondary rounded-full"></span>
                <span className="w-1 h-4 bg-primary rounded-full"></span>
              </div>
              <span className="text-primary font-bold">NOW</span>
            </div>
          </div>

          {/* Section 2: Mood Breakdown */}
          <div className="rounded-2xl p-4 bg-surface-container/60 border border-outline-variant/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-on-surface tracking-wide uppercase">
                Mood Breakdown
              </h4>
              <span className="text-[11px] font-mono text-on-surface-variant">Live</span>
            </div>

            <div className="space-y-2.5">
              {VIBE_KEYS.map((key) => {
                const meta = VIBES[key];
                const pct = breakdown[key] || 0;

                return (
                  <div key={key}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="flex items-center gap-1.5 font-medium text-on-surface">
                        <span>{meta.emoji}</span>
                        <span>{meta.label}</span>
                      </span>
                      <span className="font-mono font-bold" style={{ color: meta.accentColor }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: meta.accentColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Conversation Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant mb-1">
                <span className="material-symbols-outlined text-[18px]">forum</span>
                <span className="text-[10px] text-primary font-mono font-semibold">+18 live</span>
              </div>
              <div>
                <div className="font-headline text-2xl font-bold text-on-surface">
                  {messageCount}
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  Messages
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant mb-1">
                <span className="material-symbols-outlined text-[18px]">groups</span>
                <span className="text-[10px] text-primary font-mono font-semibold">100% active</span>
              </div>
              <div>
                <div className="font-headline text-2xl font-bold text-on-surface">
                  {participantCount}
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  Participants
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Detected Tasks & Decisions */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-0.5">
              <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5 uppercase">
                <span className="material-symbols-outlined text-primary text-[17px]">
                  auto_awesome
                </span>
                <span>Detected Tasks & Decisions</span>
              </h4>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary-container/20 text-primary font-mono font-bold">
                {decisions.length + tasks.length} Items
              </span>
            </div>

            {/* Decisions list */}
            {decisions.map((dec) => (
              <div
                key={dec.id}
                className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/30 hover:border-primary/40 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-container/20 text-primary border border-primary/30">
                    <span
                      className="material-symbols-outlined text-[13px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    Decision
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    {dec.timestamp}
                  </span>
                </div>
                <p className="text-xs font-medium text-on-surface leading-snug">
                  {dec.title}
                </p>
              </div>
            ))}

            {/* Tasks list */}
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/30 hover:border-secondary/40 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-secondary-container/20 text-secondary border border-secondary/30">
                    <span className="material-symbols-outlined text-[13px]">task_alt</span>
                    Task
                  </span>
                  <span className="text-[10px] font-mono text-tertiary font-semibold">
                    {task.due}
                  </span>
                </div>
                <p className="text-xs font-medium text-on-surface leading-snug">
                  {task.title}
                </p>
                {task.assignee && (
                  <div className="flex items-center gap-1.5 pt-1">
                    {task.assigneeAvatar && (
                      <img
                        className="w-4 h-4 rounded-full object-cover"
                        src={task.assigneeAvatar}
                        alt={task.assignee}
                      />
                    )}
                    <span className="text-[10px] text-on-surface-variant">
                      Assigned to {task.assignee}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {decisions.length === 0 && tasks.length === 0 && (
              <div className="p-3 text-center text-xs text-on-surface-variant/60 rounded-xl bg-surface-container/30 border border-outline-variant/20">
                Mention "TODO:", "I will", or "Decided to" in chat to auto-extract items.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Panel Action */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest/60 shrink-0">
          <button
            onClick={() => alert('Synced detected tasks & decisions to workspace!')}
            className="w-full py-2.5 px-3 rounded-xl bg-surface-container-high hover:bg-surface-variant border border-outline-variant/40 hover:border-outline text-on-surface text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-primary text-[18px]">
              sync_alt
            </span>
            <span>Sync to Linear & Notion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
