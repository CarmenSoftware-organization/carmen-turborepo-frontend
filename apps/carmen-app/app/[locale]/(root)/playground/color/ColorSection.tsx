import { ColorDto } from "@/constants/colors";

interface ColorSectionProps {
  title: string;
  colors: ColorDto[];
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export function ColorSection({ title, colors, sectionRef }: ColorSectionProps) {
  return (
    <div ref={sectionRef} className="space-y-4 scroll-mt-8">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {colors.map((color) => (
          <ColorSwatch key={color.cssVar} color={color} />
        ))}
      </div>
    </div>
  );
}

export function ColorSwatch({ color }: { color: ColorDto }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="h-16 w-16 rounded-full border"
        style={{ backgroundColor: `hsl(var(${color.cssVar}))` }}
      />
      <div className="space-y-1">
        <h3 className="font-medium text-sm">{color.name}</h3>
        <code className="text-xs bg-muted px-2 py-1 rounded block">
          {color.cssVar}
        </code>
      </div>
    </div>
  );
}
