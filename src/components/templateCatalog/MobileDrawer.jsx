import { useEffect } from "react";
import Select from "../ui/Select";
import TemplateCard from "./TemplateCard";
import MOCK_PROFILES from "../../data/mockProfile.json";
import { icons } from "../../constants/icons";

const Icon = ({ name, className = "" }) => (
  <span
    className={`inline-flex items-center justify-center ${className}`}
    dangerouslySetInnerHTML={{ __html: icons[name] ?? "" }}
  />
);

export default function MobileDrawer({
  open,
  onClose,
  templates,
  selectedTemplateId,
  onSelectTemplate,
  selectedProfileId,
  onSelectProfile,
}) {
  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`
          lg:hidden
          fixed inset-0
          bg-black/70
          backdrop-blur-sm
          transition-opacity duration-300
          z-[90]

          ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          lg:hidden

          fixed

          top-14
          left-0

          h-[calc(100vh-56px)]

          w-[85%]
          max-w-[360px]

          bg-[#090b09]
          border-r border-white/10

          z-[100]

          flex flex-col

          transition-transform duration-300 ease-in-out

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Header */}

        <div className="p-5 border-b border-white/10">

          <div className="flex items-center gap-3">

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center"
            >
              <Icon
                name="sidebar-collapse"
                className="w-4 h-4"
              />
            </button>

            <div className="flex-1">
              <Select
                value={selectedProfileId}
                onChange={onSelectProfile}
                options={MOCK_PROFILES.map((p) => ({
                  value: p.id,
                  label: p.label,
                }))}
              />
            </div>

          </div>

        </div>

        {/* List */}

        <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin">

          {templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              tpl={tpl}
              isSelected={tpl.id === selectedTemplateId}
              onSelect={() => {
                onSelectTemplate(tpl.id);
                onClose();
              }}
            />
          ))}

        </div>

      </aside>
    </>
  );
}