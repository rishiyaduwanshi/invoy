import { icons } from "../../constants/icons";

const Icon = ({ name, className = "" }) => (
  <span
    className={`inline-flex items-center justify-center ${className}`}
    dangerouslySetInnerHTML={{ __html: icons[name] ?? "" }}
  />
);

export default function TemplateCard({
  tpl,
  isSelected,
  onSelect,
}) {
  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-xl border p-4 transition-all duration-200 relative overflow-hidden backdrop-blur-sm ${
        isSelected
          ? "border-brand bg-brand/5 shadow-[0_0_15px_rgba(34,197,94,0.06)]"
          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15"
      }`}
    >
      <div className="flex justify-between items-start gap-3 mb-2">

        <div className="flex items-center gap-2">
          <span className="text-lg">{tpl.emoji}</span>

          <h3 className="font-bold text-sm text-white group-hover:text-brand transition-colors">
            {tpl.name}
          </h3>
        </div>

        {isSelected && (
          <span className="text-[9px] bg-brand/20 border border-brand/20 text-brand px-2 py-0.5 rounded-full font-bold">
            Selected
          </span>
        )}
      </div>

      <p className="text-[11px] text-neutral-400 leading-normal mb-3">
        {tpl.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {tpl.features.map((feature, i) => (
          <span
            key={i}
            className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-500 font-semibold uppercase tracking-wider"
          >
            {feature}
          </span>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-white/5">

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`flex-1 rounded-lg py-1.5 text-[11px] font-bold transition ${
            isSelected
              ? "bg-brand/10 border border-brand/20 text-brand"
              : "bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
          }`}
        >
          Preview
        </button>

        <a
          href={`/app?template=${tpl.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 rounded-lg py-1.5 bg-brand text-black text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-[#16a34a]"
        >
          Use Design

          <Icon
            name="arrow-left"
            className="rotate-180 w-2.5 h-2.5"
          />
        </a>
      </div>
    </div>
  );
}