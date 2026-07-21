import FlowerIcon from "./FlowerIcon";

type DividerProps = {
  className?: string;
};

export default function Divider({ className = "" }: DividerProps) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-16 sm:w-24 hairline" />
      <FlowerIcon size={18} tone="gold" className="shrink-0 drop-shadow-[0_1px_3px_rgba(198,161,91,0.45)]" />
      <span className="h-px w-16 sm:w-24 hairline" />
    </div>
  );
}
