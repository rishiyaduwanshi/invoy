import { useState, useEffect } from 'react';
import { TEMPLATES } from '../templates/index';
import InvoicePreview from './InvoicePreview';
import { icons } from '../constants/icons';
import Select from './ui/Select';
import MOCK_PROFILES from '../data/mockProfile.json';

const Icon = ({ name, className = '' }) => (
  <span className={`inline-flex items-center justify-center ${className}`} dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />
);

export default function TemplatesCatalog() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [selectedProfileId, setSelectedProfileId] = useState(MOCK_PROFILES[0].id);
  const [previewData, setPreviewData] = useState(MOCK_PROFILES[0].data);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize sidebar based on screen size (default open on large screens)
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024);
    }
  }, []);

  // Update preview data when selected profile or template changes
  useEffect(() => {
    const profile = MOCK_PROFILES.find(p => p.id === selectedProfileId) || MOCK_PROFILES[0];
    setPreviewData({
      ...profile.data,
      template: selectedTemplateId
    });
  }, [selectedTemplateId, selectedProfileId]);

  const handleSelectTemplate = (tplId) => {
    setSelectedTemplateId(tplId);
    // On mobile, auto-close sidebar overlay on choice so they can see full preview
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-white font-['Inter'] px-4 py-8 sm:py-12 max-w-7xl mx-auto relative z-10">

      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-brand/8 blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/6 blur-[130px] pointer-events-none z-0"></div>

      {/* Hero section */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 bg-brand/5 text-brand text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
          🎨 Visual Catalog
        </span>
        <h1 className="text-4xl sm:text-5xl font-black font-['Outfit'] tracking-tight mb-3 text-white">
          Invoice <span className="text-brand">Templates</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          Choose from 6 beautifully crafted, responsive templates. Custom layouts, responsive margins, and optimized parameters.
        </p>
      </div>

      {/* Mobile backdrop drawer overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main container flex: left panel catalog list, right panel preview sheet */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6 relative z-10 min-h-[calc(100vh-14rem)]">

        {/* Left Sidebar: Select Template & Business profile (Overlay on mobile, sidebar panel on desktop) */}
        <div
          className={`
            fixed inset-y-0 left-0 z-[100] w-[85%] max-w-[340px] bg-[#090b09]/98 border-r border-white/10 p-5 flex flex-col
            lg:sticky lg:top-20 lg:h-[calc(100vh-8rem)] lg:bg-transparent lg:border-r-0 lg:p-0 lg:z-10 lg:overflow-hidden
            transition-all duration-300 ease-in-out
            ${isSidebarOpen
              ? 'translate-x-0 opacity-100 lg:w-[350px] xl:w-[380px] shrink-0'
              : '-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:overflow-hidden'
            }
          `}
        >
          {/* Top Row: Sidebar Toggle (Left) + Custom Select Mock Profile (Right) */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/5 mb-4 shrink-0">
            {/* Desktop Collapse / Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="w-10 h-[42px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all hover:scale-102 active:scale-98"
              title="Hide templates sidebar"
            >
              <Icon name="sidebar-collapse" className="w-4 h-4 shrink-0" />
            </button>

            {/* Custom Select Box for Profile Selection */}
            <div className="flex-grow max-w-[210px]">
              <Select
                value={selectedProfileId}
                onChange={setSelectedProfileId}
                options={MOCK_PROFILES.map(p => ({
                  label: p.label,
                  value: p.id
                }))}
                size="md"
                placeholder="Choose profile..."
              />
            </div>
          </div>

          {/* Templates list card stack (Scrollable inner box) */}
          <div className="flex-grow overflow-y-auto pr-1.5 scrollbar-thin flex flex-col gap-3">
            <span className="block text-[9px] font-bold text-neutral-500 uppercase tracking-widest px-1">
              Select Style ({TEMPLATES.length} templates)
            </span>

            <div className="flex flex-col gap-3 pb-4">
              {TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`group cursor-pointer rounded-xl border p-4 transition-all duration-200 relative overflow-hidden backdrop-blur-sm ${isSelected
                        ? 'border-brand bg-brand/5 shadow-[0_0_15px_rgba(34,197,94,0.06)]'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15'
                      }`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{tpl.emoji}</span>
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-brand transition-colors">
                          {tpl.name}
                        </h3>
                      </div>
                      {isSelected && (
                        <span className="text-[9px] bg-brand/20 text-brand px-2 py-0.5 rounded-full font-bold border border-brand/20">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-normal mb-3">
                      {tpl.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {tpl.features.map((feat, idx) => (
                        <span key={idx} className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-500 font-semibold uppercase tracking-wider">
                          {feat}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2.5 border-t border-white/5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTemplate(tpl.id);
                        }}
                        className={`flex-1 text-center py-1.5 rounded-lg text-[11px] font-bold transition-all ${isSelected
                            ? 'bg-brand/10 border border-brand/20 text-brand'
                            : 'bg-white/5 border border-white/10 text-neutral-300 hover:text-white'
                          }`}
                      >
                        Preview
                      </button>
                      <a
                        href={`/app?template=${tpl.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 text-center py-1.5 rounded-lg text-[11px] font-bold bg-brand text-black hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Use Design</span>
                        <Icon name="arrow-left" className="rotate-180 w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Pane: Immersive Mockup Preview (Header is static, preview content scrolls underneath) */}
        <div className="flex-1 min-w-0">
          <div className="sticky top-20 lg:h-[calc(100vh-8rem)] flex flex-col rounded-2xl bg-neutral-900/60 border border-white/8 p-3.5 sm:p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/2 via-transparent to-indigo-500/2 pointer-events-none rounded-2xl" />

            {/* Header of Preview Box (Static top control bar, never scrolls out of view) */}
            <div className="flex items-center justify-between mb-4 relative z-10 pb-3 border-b border-white/5 shrink-0">

              {/* Left action toggles */}
              <div className="flex items-center gap-2.5">
                {/* Desktop Toggle Button (only shown when sidebar is closed) */}
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/10 transition-all hover:scale-102 active:scale-98"
                    title="Show templates list"
                  >
                    <Icon name="sidebar-expand" className="w-4 h-4 shrink-0" />
                    <span>Show Side Panel</span>
                  </button>
                )}

                {/* Mobile Drawer Trigger Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand text-black font-bold text-xs transition-all hover:scale-102 active:scale-98"
                >
                  <Icon name="menu" className="w-3.5 h-3.5 shrink-0" />
                  <span>Templates</span>
                </button>

                {isSidebarOpen && <span className="text-xs text-neutral-500 font-medium hidden lg:inline">Live Layout Preview</span>}

                <div className="w-px h-4 bg-white/10" />

                {/* Traffic dots */}
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
              </div>

              {/* Active Template status badge */}
              {(() => {
                const activeT = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
                return (
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-bold border"
                    style={{
                      backgroundColor: `${activeT.accentColor}15`,
                      borderColor: `${activeT.accentColor}40`,
                      color: activeT.accentColor === '#111827' ? '#9ca3af' : activeT.accentColor
                    }}
                  >
                    {activeT.emoji} {activeT.name}
                  </span>
                );
              })()}
            </div>

            {/* Render Preview Sheet Container (Scrollable viewport) */}
            <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-thin rounded-xl relative border border-white/5">
              <InvoicePreview template={selectedTemplateId} data={previewData} />
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Floating Action Button (FAB) shown only when sidebar/drawer is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 px-5 py-3.5 rounded-full bg-brand text-black font-bold text-sm shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:bg-[#16a34a] hover:scale-105 active:scale-95 transition-all"
        >
          <Icon name="menu" className="w-4 h-4 shrink-0" />
          <span>Change Design</span>
        </button>
      )}

      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
      `}</style>
    </div>
  );
}
