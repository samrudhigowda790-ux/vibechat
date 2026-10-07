import React from 'react';
import { CURRENT_USER } from '../data/mockConversations';

export default function TopNavBar({
  activeTab,
  setActiveTab,
  backendStatus,
  onToggleSidebar,
  onToggleInsights,
  isInsightsOpen,
}) {
  const tabs = ['All Activity', 'Mentions', 'Key Decisions', 'Vibe Telemetry'];

  return (
    <header className="flex justify-between items-center w-full px-4 lg:px-6 h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 shrink-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg transition-colors"
          title="Toggle Sidebar"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-secondary-container via-primary-container to-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary-fixed text-[18px]">forum</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-[18px] tracking-tight text-on-surface hidden sm:inline">
              VibeChat Workspace
            </span>
            <span className="font-headline font-bold text-[18px] tracking-tight text-on-surface sm:hidden">
              VibeChat
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-[10px] font-bold text-primary uppercase tracking-wider">
              v2.4 Pro
            </span>

            {/* Backend / Database Connection Status Badge */}
            {backendStatus && (
              <span
                className={`hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  backendStatus.dbConnected
                    ? 'bg-primary-container/20 border-primary/40 text-primary'
                    : 'bg-tertiary-container/20 border-tertiary/40 text-tertiary'
                }`}
                title={backendStatus.message}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    backendStatus.dbConnected ? 'bg-primary animate-pulse' : 'bg-tertiary'
                  }`}
                ></span>
                <span>{backendStatus.message}</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center ml-8 gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Right Utility Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/20">
          <button className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded" title="Filters">
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
          <button className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded relative" title="Notifications">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-low"></span>
          </button>
          <button className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded" title="Help">
            <span className="material-symbols-outlined text-[18px]">help</span>
          </button>
        </div>

        <div className="hidden sm:block h-5 w-px bg-outline-variant/30"></div>

        <button className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-container to-primary hover:brightness-110 text-on-primary-fixed text-xs font-semibold transition-all shadow-sm active:scale-[0.98]">
          <span className="material-symbols-outlined text-[16px]">sync</span>
          <span>Start Sync</span>
        </button>

        {/* Toggle Insights on medium screens */}
        <button
          onClick={onToggleInsights}
          className={`xl:hidden p-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
            isInsightsOpen
              ? 'bg-primary-container/20 border-primary text-primary'
              : 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
          }`}
          title="Toggle Insights Panel"
        >
          <span className="material-symbols-outlined text-[18px]">monitoring</span>
          <span className="text-xs font-semibold hidden md:inline">Insights</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center pl-1">
          <div className="relative p-0.5 rounded-full ring-2 ring-primary/80 ring-offset-2 ring-offset-surface-container-lowest">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.displayName}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full ring-1 ring-surface-container-lowest"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
