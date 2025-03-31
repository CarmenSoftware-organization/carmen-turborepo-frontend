# Carmen Platform UI Guide

This guide outlines the design system, components, and styling patterns used across the Carmen Platform to ensure consistency and usability.

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Layout Guidelines](#layout-guidelines)
6. [Components](#components)
7. [Icons & Imagery](#icons--imagery)
8. [Responsive Design](#responsive-design)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [UI Patterns](#ui-patterns)

## Design Principles

### Clarity
- Prioritize clear, readable interfaces
- Reduce cognitive load with well-organized layouts
- Provide clear feedback for all user actions

### Consistency
- Maintain consistent patterns across all interfaces
- Use the same component for the same function everywhere
- Apply consistent spacing and alignment

### Efficiency
- Design for minimal clicks to complete common tasks
- Organize information in logical hierarchies
- Ensure interfaces are scannable

### Modularity
- Build interfaces from reusable components
- Ensure components can be composed into larger patterns
- Maintain clear component boundaries and responsibilities

## Color System

The Carmen Platform uses a color palette based on Tailwind CSS's color system, with custom theme colors defined for semantic meaning.

### Primary Colors

- **Primary**: `hsl(221.2 83.2% 53.3%)` - Used for primary buttons, active states, and key UI elements
- **Primary Foreground**: `hsl(210 40% 98%)` - Text on primary backgrounds

### Semantic Colors

- **Secondary**: `hsl(210 40% 96.1%)` - Used for secondary buttons and less prominent UI elements
- **Secondary Foreground**: `hsl(222.2 47.4% 11.2%)` - Text on secondary backgrounds
- **Accent**: `hsl(210 40% 96.1%)` - Used for highlighting or accent elements
- **Accent Foreground**: `hsl(222.2 47.4% 11.2%)` - Text on accent backgrounds
- **Destructive**: `hsl(0 84.2% 60.2%)` - Used for destructive actions, errors
- **Destructive Foreground**: `hsl(210 40% 98%)` - Text on destructive backgrounds
- **Success**: `hsl(142.1 76.2% 36.3%)` - Used for success states
- **Warning**: `hsl(48 96% 53%)` - Used for warning states

### Neutral Colors

- **Background**: `hsl(0 0% 100%)` - Page background
- **Foreground**: `hsl(222.2 84% 4.9%)` - Primary text
- **Card**: `hsl(0 0% 100%)` - Card and container backgrounds
- **Card Foreground**: `hsl(222.2 84% 4.9%)` - Text on cards
- **Muted**: `hsl(210 40% 96.1%)` - Muted/subdued areas
- **Muted Foreground**: `hsl(215.4 16.3% 46.9%)` - Secondary text, labels
- **Border**: `hsl(214.3 31.8% 91.4%)` - Borders, dividers

### Dark Mode Colors

The platform also includes dark mode variants of all colors, which are automatically applied with the `.dark` class.

## Typography

### Font Stack

The Carmen Platform uses the Inter font family as its primary typeface through the following CSS variable:

```css
--font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
```

### Type Scale

Based on Tailwind's type scale:

- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)

### Font Weights

- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700

### Line Heights

- **tight**: 1.25
- **normal**: 1.5
- **relaxed**: 1.75

### Typography Usage

| Element | Font Size | Font Weight | Line Height | Use Case |
|---------|-----------|-------------|-------------|----------|
| h1 | 4xl-5xl | bold | tight | Page titles |
| h2 | 3xl | bold | tight | Section headings |
| h3 | 2xl | semibold | tight | Sub-section headings |
| h4 | xl | semibold | tight | Card titles |
| Body | base | normal | normal | Main content |
| Small | sm | normal | normal | Secondary text |
| Caption | xs | normal | normal | Labels, metadata |

## Spacing System

Based on Tailwind's spacing scale with 4px (0.25rem) increments:

- **0**: 0px
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)
- **32**: 8rem (128px)

### Spacing Guidelines

- **Component Padding**: Use 4-6 for small components, 6-8 for larger components
- **Content Margins**: Use 4-8 for separating content sections
- **Section Spacing**: Use 12-20 for major section separation
- **Grid Gaps**: Use 4-8 for regular grids of content

## Layout Guidelines

### Container Widths

- **Default**: max-w-7xl (1280px)
- **Small**: max-w-3xl (768px)
- **Medium**: max-w-5xl (1024px)
- **Full**: w-full

### Grid System

Use Tailwind's grid system:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Content -->
</div>
```

### Layout Patterns

- Use single-column layouts for mobile
- Use multi-column layouts for tablet and desktop
- Maintain consistent content width and padding across pages

## Components

Carmen Platform uses shadcn/ui components, which are built on Radix UI primitives. These components are imported into the project and can be customized.

### How to Use Components

Components are imported from `@/components/ui`:

```jsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
```

### Core Components

#### Button

```jsx
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Tertiary Action</Button>
<Button variant="ghost">Subtle Action</Button>
<Button variant="destructive">Delete</Button>
```

Button sizes:

```jsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

#### Card

```jsx
  <Card>
    <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
    </CardHeader>
    <CardContent>
    Card content goes here
    </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
  </Card>
```

#### Form Components

```jsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

#### Dialog

```jsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>This is a dialog description</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Table

```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Example Item</TableCell>
      <TableCell>Active</TableCell>
      <TableCell>
        <Button variant="ghost" size="sm">Edit</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Component Best Practices

- Use shadcn/ui components whenever possible
- Keep component prop variations consistent
- For complex composite components, create wrappers in the components directory
- Document component usage and variants

## Icons & Imagery

### Icons

Carmen Platform uses Lucide React for icons. Import icons directly:

```jsx
import { Users, Building, Settings } from "lucide-react";

<Users className="h-5 w-5" />
```

### Icon Sizes

- **Small**: h-4 w-4 (16px)
- **Medium**: h-5 w-5 (20px)
- **Large**: h-6 w-6 (24px)
- **Extra Large**: h-8 w-8 (32px)

### Images

Use Next.js Image component for optimized images:

```jsx
import Image from "next/image";

<Image 
  src="/path/to/image.jpg" 
  alt="Description" 
  width={400} 
  height={300} 
  className="rounded-lg"
/>
```

For external images, configure domains in next.config.js:

```js
images: {
  domains: ['images.unsplash.com'],
},
```

## Responsive Design

Carmen Platform follows a mobile-first approach using Tailwind's responsive prefixes:

- **Base**: Mobile (< 640px)
- **sm**: Small screens (≥ 640px)
- **md**: Medium screens (≥ 768px)
- **lg**: Large screens (≥ 1024px)
- **xl**: Extra large screens (≥ 1280px)
- **2xl**: 2X large screens (≥ 1536px)

### Responsive Patterns

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Content */}
</div>

<div className="flex flex-col md:flex-row">
  {/* Content */}
</div>

<div className="hidden md:block">
  {/* Only visible on medium screens and up */}
</div>
```

### Mobile Optimization Guidelines

- Simplify interfaces for mobile
- Stack elements vertically on mobile
- Hide non-essential UI on small screens
- Use appropriate touch targets (min 44×44px)
- Test on various viewport sizes

## Accessibility Guidelines

### General Principles

- Use semantic HTML elements
- Maintain color contrast ratios (4.5:1 minimum)
- Ensure keyboard navigability
- Provide focus indicators
- Support screen readers

### Accessibility Implementation

- Use proper heading hierarchy (h1 → h6)
- Add `aria-label` attributes for non-text elements
- Include `alt` text for all images
- Use `aria-expanded`, `aria-controls` for interactive elements
- Test with keyboard navigation

```jsx
// Good example
<button 
  aria-label="Close dialog" 
  onClick={closeDialog}
>
  <XIcon className="h-4 w-4" />
</button>
```

## UI Patterns

### Dashboard Layout

```jsx
<div className="min-h-screen flex flex-col">
  <header className="border-b bg-background">
    {/* Header content */}
  </header>
  <div className="flex-1 flex">
    <aside className="w-64 border-r bg-background hidden md:block">
      {/* Sidebar navigation */}
    </aside>
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Title</h1>
      {/* Main content */}
    </main>
  </div>
</div>
```

### Data Table Pattern

```jsx
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-semibold">Items</h2>
    <Button>
      <PlusIcon className="h-4 w-4 mr-2" />
      Add Item
    </Button>
  </div>
  
  <div className="rounded-md border">
    <Table>
      {/* Table content */}
    </Table>
    </div>
  
  <div className="flex items-center justify-end space-x-2">
    {/* Pagination */}
  </div>
</div>
```

### Form Layout Pattern

```jsx
<Card>
  <CardHeader>
    <CardTitle>Form Title</CardTitle>
    <CardDescription>Form description and instructions</CardDescription>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields */}
          </div>
      </form>
    </Form>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Submit</Button>
  </CardFooter>
</Card>
```

### Empty State Pattern

```jsx
<div className="flex flex-col items-center justify-center p-12 text-center">
  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
    <Icon className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-medium mb-2">No items found</h3>
  <p className="text-muted-foreground mb-4 max-w-md">
    There are no items available. Create your first item to get started.
  </p>
  <Button>
    <PlusIcon className="h-4 w-4 mr-2" />
    Create Item
  </Button>
</div>
```