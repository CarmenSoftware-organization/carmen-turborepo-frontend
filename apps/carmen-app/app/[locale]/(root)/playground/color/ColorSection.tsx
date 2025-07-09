import { ColorDto } from "@/constants/colors";

interface ColorSectionProps {
  title: string;
  colors: ColorDto[];
  sectionRef: React.RefObject<HTMLDivElement>;
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
    <div className="border rounded-lg p-4 bg-card">
      <div
        className="w-full h-16 rounded-md border mb-3"
        style={{ backgroundColor: `hsl(var(${color.cssVar}))` }}
      />
      <div className="space-y-1">
        <h3 className="font-medium text-sm">{color.name}</h3>
        <p className="text-xs text-muted-foreground">{color.description}</p>
        <code className="text-xs bg-muted px-2 py-1 rounded block">
          {color.cssVar}
        </code>
      </div>
    </div>
  );
}
