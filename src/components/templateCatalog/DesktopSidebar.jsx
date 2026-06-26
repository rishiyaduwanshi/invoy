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

export default function DesktopSidebar({
  isOpen,
  onClose,
  templates,
  selectedTemplateId,
  onSelectTemplate,
  selectedProfileId,
  onSelectProfile,
}) {
  if (!isOpen) return null;

  return (
    <aside
      className="
        hidden lg:flex
        sticky top-20
        h-[calc(100vh-6rem)]
        w-[360px]
        shrink-0
        rounded-2xl
        border border-white/10
        bg-neutral-900/60
        backdrop-blur-xl
        p-5
        flex-col
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">

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

      {/* Title */}

      <div className="mt-5 mb-3">
        <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
          Templates ({templates.length})
        </h3>
      </div>

      {/* List */}

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">

        {templates.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            tpl={tpl}
            isSelected={tpl.id === selectedTemplateId}
            onSelect={() => onSelectTemplate(tpl.id)}
          />
        ))}

      </div>
    </aside>
  );
}