export interface ColorDto {
    name: string;
    cssVar: string;
    category: string;
    description: string;
  }
  
  export const colorPalette: ColorDto[] = [
    // Base Colors
    {
      name: "Background",
      cssVar: "--background",
      category: "Base",
      description: "หลัก - พื้นหลัง",
    },
    {
      name: "Foreground",
      cssVar: "--foreground",
      category: "Base",
      description: "หลัก - ข้อความ",
    },
  
    // Component Colors
    {
      name: "Card",
      cssVar: "--card",
      category: "Component",
      description: "พื้นหลัง Card",
    },
    {
      name: "Card Foreground",
      cssVar: "--card-foreground",
      category: "Component",
      description: "ข้อความใน Card",
    },
    {
      name: "Popover",
      cssVar: "--popover",
      category: "Component",
      description: "พื้นหลัง Popover",
    },
    {
      name: "Popover Foreground",
      cssVar: "--popover-foreground",
      category: "Component",
      description: "ข้อความใน Popover",
    },
  
    // Brand Colors
    {
      name: "Primary",
      cssVar: "--primary",
      category: "Brand",
      description: "สีหลัก",
    },
    {
      name: "Primary Foreground",
      cssVar: "--primary-foreground",
      category: "Brand",
      description: "ข้อความบนสีหลัก",
    },
    {
      name: "Secondary",
      cssVar: "--secondary",
      category: "Brand",
      description: "สีรอง",
    },
    {
      name: "Secondary Foreground",
      cssVar: "--secondary-foreground",
      category: "Brand",
      description: "ข้อความบนสีรอง",
    },
  
    // Utility Colors
    {
      name: "Muted",
      cssVar: "--muted",
      category: "Utility",
      description: "สีเบา",
    },
    {
      name: "Muted Foreground",
      cssVar: "--muted-foreground",
      category: "Utility",
      description: "ข้อความบนสีเบา",
    },
    {
      name: "Accent",
      cssVar: "--accent",
      category: "Utility",
      description: "สีเน้น",
    },
    {
      name: "Accent Foreground",
      cssVar: "--accent-foreground",
      category: "Utility",
      description: "ข้อความบนสีเน้น",
    },
    {
      name: "Destructive",
      cssVar: "--destructive",
      category: "Utility",
      description: "สีอันตราย",
    },
    {
      name: "Destructive Foreground",
      cssVar: "--destructive-foreground",
      category: "Utility",
      description: "ข้อความบนสีอันตราย",
    },
  
    // Interface Colors
    {
      name: "Border",
      cssVar: "--border",
      category: "Interface",
      description: "เส้นขอบ",
    },
    {
      name: "Input",
      cssVar: "--input",
      category: "Interface",
      description: "พื้นหลัง Input",
    },
    {
      name: "Ring",
      cssVar: "--ring",
      category: "Interface",
      description: "วงมือ Focus",
    },
  
    // Chart Colors
    {
      name: "Chart 1",
      cssVar: "--chart-1",
      category: "Chart",
      description: "สีกราฟ 1",
    },
    {
      name: "Chart 2",
      cssVar: "--chart-2",
      category: "Chart",
      description: "สีกราฟ 2",
    },
    {
      name: "Chart 3",
      cssVar: "--chart-3",
      category: "Chart",
      description: "สีกราฟ 3",
    },
    {
      name: "Chart 4",
      cssVar: "--chart-4",
      category: "Chart",
      description: "สีกราฟ 4",
    },
    {
      name: "Chart 5",
      cssVar: "--chart-5",
      category: "Chart",
      description: "สีกราฟ 5",
    },
  
    // Sidebar Colors
    {
      name: "Sidebar Background",
      cssVar: "--sidebar-background",
      category: "Sidebar",
      description: "พื้นหลัง Sidebar",
    },
    {
      name: "Sidebar Foreground",
      cssVar: "--sidebar-foreground",
      category: "Sidebar",
      description: "ข้อความ Sidebar",
    },
    {
      name: "Sidebar Primary",
      cssVar: "--sidebar-primary",
      category: "Sidebar",
      description: "สีหลัก Sidebar",
    },
    {
      name: "Sidebar Primary Foreground",
      cssVar: "--sidebar-primary-foreground",
      category: "Sidebar",
      description: "ข้อความบนสีหลัก Sidebar",
    },
    {
      name: "Sidebar Accent",
      cssVar: "--sidebar-accent",
      category: "Sidebar",
      description: "สีเน้น Sidebar",
    },
    {
      name: "Sidebar Accent Foreground",
      cssVar: "--sidebar-accent-foreground",
      category: "Sidebar",
      description: "ข้อความบนสีเน้น Sidebar",
    },
    {
      name: "Sidebar Border",
      cssVar: "--sidebar-border",
      category: "Sidebar",
      description: "เส้นขอบ Sidebar",
    },
    {
      name: "Sidebar Ring",
      cssVar: "--sidebar-ring",
      category: "Sidebar",
      description: "วงมือ Focus Sidebar",
    },
  ];