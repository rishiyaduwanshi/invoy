import { useEffect, useState } from "react";

import { TEMPLATES } from "../../templates";
import MOCK_PROFILES from "../../data/mockProfile.json";

import InvoicePreview from "../InvoicePreview";
import DesktopSidebar from "./DesktopSidebar";
import MobileDrawer from "./MobileDrawer";

import { icons } from "../../constants/icons";

const Icon = ({ name, className = "" }) => (
  <span
    className={`inline-flex items-center justify-center ${className}`}
    dangerouslySetInnerHTML={{ __html: icons[name] ?? "" }}
  />
);

export default function TemplatesCatalog() {
  const [mounted, setMounted] = useState(false);

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    TEMPLATES[0].id
  );

  const [selectedProfileId, setSelectedProfileId] = useState(
    MOCK_PROFILES[0].id
  );

  const [previewData, setPreviewData] = useState(
    MOCK_PROFILES[0].data
  );

  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const profile =
      MOCK_PROFILES.find(
        (item) => item.id === selectedProfileId
      ) || MOCK_PROFILES[0];

    setPreviewData({
      ...profile.data,
      template: selectedTemplateId,
    });
  }, [selectedTemplateId, selectedProfileId]);

  const handleTemplateSelect = (id) => {
    setSelectedTemplateId(id);

    if (window.innerWidth < 1024) {
      setMobileDrawerOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="min-h-screen relative max-w-7xl mx-auto px-4 py-8 sm:py-12 text-white">

        {/* Background Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-brand/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

        {/* Hero */}

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-12">

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest">
            🎨 Visual Catalog
          </span>

          <h1 className="mt-5 text-4xl sm:text-5xl font-black font-['Outfit']">
            Invoice <span className="text-brand">Templates</span>
          </h1>

          <p className="mt-4 text-neutral-400 text-sm leading-relaxed">
            Choose from beautifully crafted responsive invoice templates.
          </p>

        </div>

        {/* Mobile Drawer */}

        <MobileDrawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          templates={TEMPLATES}
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={handleTemplateSelect}
          selectedProfileId={selectedProfileId}
          onSelectProfile={setSelectedProfileId}
        />

        {/* Layout */}

        <div className="relative z-10 flex gap-6">

          {/* Desktop Sidebar */}

          <DesktopSidebar
            isOpen={desktopSidebarOpen}
            onClose={() => setDesktopSidebarOpen(false)}
            templates={TEMPLATES}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleTemplateSelect}
            selectedProfileId={selectedProfileId}
            onSelectProfile={setSelectedProfileId}
          />

          {/* Preview */}

          <div className="flex-1 min-w-0">

            <div className="sticky top-20 h-[calc(100vh-6rem)] rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl overflow-hidden flex flex-col">

              {/* Header */}

              <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">

                <div className="flex items-center gap-2">

                  {!desktopSidebarOpen && (

                    <button
                      onClick={() =>
                        setDesktopSidebarOpen(true)
                      }
                      className="hidden lg:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                      <Icon
                        name="sidebar-expand"
                        className="w-4 h-4"
                      />

                      Show Templates
                    </button>

                  )}

                  <button
                    onClick={() =>
                      setMobileDrawerOpen(true)
                    }
                    className="lg:hidden bg-brand text-black rounded-lg px-3 py-2 text-sm font-bold"
                  >
                    Templates
                  </button>

                </div>

                {(() => {
                  const active =
                    TEMPLATES.find(
                      (t) =>
                        t.id === selectedTemplateId
                    ) || TEMPLATES[0];

                  return (
                    <span
                      className="text-xs rounded-full border px-3 py-1 font-bold"
                      style={{
                        backgroundColor:
                          active.accentColor + "20",
                        borderColor:
                          active.accentColor + "50",
                        color: active.accentColor,
                      }}
                    >
                      {active.emoji} {active.name}
                    </span>
                  );
                })()}

              </div>

              {/* Preview Body */}

              <div className="flex-1 overflow-auto scrollbar-thin p-3">

                <div className="min-w-[800px]">

                  <InvoicePreview
                    template={selectedTemplateId}
                    data={previewData}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Floating Button */}

        {!mobileDrawerOpen && (
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 rounded-full bg-brand text-black px-5 py-3 shadow-xl font-bold"
          >
            <Icon
              name="menu"
              className="w-4 h-4"
            />

            Change Design
          </button>
        )}

      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar{
          width:4px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb{
          background:rgba(255,255,255,.12);
          border-radius:999px;
        }

        .scrollbar-thin::-webkit-scrollbar-track{
          background:transparent;
        }
      `}</style>

    </>
  );
}
