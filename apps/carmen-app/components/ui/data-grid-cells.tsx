import { CellContext, Column, Row } from "@tanstack/react-table";
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "./data-grid-column-header";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import React from "react";

/**
 * Reusable cell components for DataGrid
 * These components are extracted to prevent re-creation on every render
 * and can be reused across different list components
 */

// ============================================
// SELECT COLUMN (Checkbox)
// ============================================

export const SelectHeader = () => <DataGridTableRowSelectAll />;

export const SelectCell = <TData,>({ row }: { row: Row<TData> }) => (
  <DataGridTableRowSelect row={row} />
);

// ============================================
// NUMBER COLUMN (Index/Row Number)
// ============================================

export const NumberHeader = () => <div className="text-center">#</div>;

interface NumberCellProps<TData> {
  row: Row<TData>;
  currentPage: number;
  perpage: number;
}

export const NumberCell = <TData,>({ row, currentPage, perpage }: NumberCellProps<TData>) => (
  <div className="text-center">{(currentPage - 1) * perpage + row.index + 1}</div>
);

/**
 * Factory function to create a NumberCell wrapper with pre-bound props
 * This solves the SonarQube warning about nested functions in column definitions
 *
 * @example
 * const columns = useMemo(() => [
 *   {
 *     id: "no",
 *     header: NumberHeader,
 *     cell: createNumberCellWrapper({ currentPage, perpage }),
 *     size: 20,
 *   },
 * ], [currentPage, perpage]);
 */
interface NumberCellWrapperProps {
  currentPage: number;
  perpage: number;
}

export const createNumberCellWrapper = <TData,>(props: NumberCellWrapperProps) => {
  return function NumberCellWrapper({ row }: { row: Row<TData> }) {
    return <NumberCell row={row} {...props} />;
  };
};

interface DataGridHeaderConfig {
  title: string;
  icon?: React.ReactNode;
  /**
   * Header alignment position
   * @default 'left'
   */
  align?: "left" | "center" | "right";
}

/**
 * Factory function to create a DataGrid header renderer with configurable alignment
 *
 * @example
 * // Left align (default)
 * header: DataGridHeaderRenderer({ title: "Name", icon: <List /> })
 *
 * // Center align
 * header: DataGridHeaderRenderer({ title: "Status", align: 'center' })
 *
 * // Right align
 * header: DataGridHeaderRenderer({ title: "Action", align: 'right' })
 */
export const DataGridHeaderRenderer = <T,>(config: DataGridHeaderConfig) => {
  const HeaderComponent = ({ column }: { column: Column<T> }) => {
    const alignClass =
      config.align === "center"
        ? "flex justify-center"
        : config.align === "right"
          ? "flex justify-end"
          : "";

    const header = <DataGridColumnHeader column={column} title={config.title} icon={config.icon} />;

    if (config.align && config.align !== "left") {
      return <div className={alignClass}>{header}</div>;
    }

    return header;
  };
  HeaderComponent.displayName = "DataGridHeaderComponent";
  return HeaderComponent;
};

// ============================================
// GENERIC CELL RENDERER
// ============================================

interface DataGridCellConfig<T> {
  /**
   * Function to get the value to display
   */
  getValue: (item: T) => React.ReactNode;
  /**
   * Cell content alignment
   * @default 'left'
   */
  align?: "left" | "center" | "right";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Factory function to create a generic DataGrid cell renderer with configurable alignment
 *
 * @example
 * // Simple text cell (left align - default)
 * cell: DataGridCellRenderer<Department>({
 *   getValue: (item) => item.description
 * })
 *
 * // Center aligned cell
 * cell: DataGridCellRenderer<Department>({
 *   getValue: (item) => item.code,
 *   align: 'center'
 * })
 *
 * // Custom component with alignment
 * cell: DataGridCellRenderer<Department>({
 *   getValue: (item) => <StatusBadge status={item.status} />,
 *   align: 'center'
 * })
 */
export const DataGridCellRenderer = <T,>(config: DataGridCellConfig<T>) => {
  const CellComponent = ({ row }: CellContext<T, unknown>) => {
    const content = config.getValue(row.original);

    const alignClass =
      config.align === "center"
        ? "flex justify-center"
        : config.align === "right"
          ? "flex justify-end"
          : "";

    const className = [alignClass, config.className].filter(Boolean).join(" ");

    if (className) {
      return <div className={className}>{content}</div>;
    }

    return <>{content}</>;
  };
  CellComponent.displayName = "DataGridCellComponent";
  return CellComponent;
};

// ============================================
// LINK CELL RENDERER
// ============================================

interface LinkCellConfig<T> {
  canUpdate: boolean;
  getHref: (item: T) => string;
  getValue: (item: T) => string;
  className?: string;
}

const LinkCell = ({
  canUpdate,
  href,
  value,
  className,
}: {
  canUpdate: boolean;
  href: string;
  value: string;
  className?: string;
}) => {
  if (canUpdate) {
    return (
      <Link
        href={href}
        className={
          className ||
          "hover:underline hover:underline-offset text-primary dark:text-primary-foreground hover:text-primary/80"
        }
      >
        {value}
      </Link>
    );
  }

  return <span className="max-w-[200px] break-words">{value}</span>;
};

export const LinkCellRenderer = <T,>(config: LinkCellConfig<T>) => {
  const CellComponent = ({ row }: CellContext<T, unknown>) => {
    const item = row.original;
    return (
      <LinkCell
        canUpdate={config.canUpdate}
        href={config.getHref(item)}
        value={config.getValue(item)}
        className={config.className}
      />
    );
  };
  CellComponent.displayName = "LinkCellComponent";
  return CellComponent;
};

// ============================================
// ACTION CELL RENDERER
// ============================================

interface ActionMenuItem<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  show?: boolean;
  className?: string;
}

interface DataGridActionCellConfig<T> {
  actions: ActionMenuItem<T>[];
  /**
   * Show action button even if no visible actions
   * @default false
   */
  showAlways?: boolean;
  /**
   * Align position
   * @default 'right'
   */
  align?: "left" | "center" | "right";
}

/**
 * Factory function to create a DataGrid action cell renderer with dropdown menu
 *
 * @example
 * cell: DataGridActionCellRenderer<Department>({
 *   actions: [
 *     {
 *       label: t("edit"),
 *       icon: <Edit className="h-4 w-4" />,
 *       onClick: (item) => handleEdit(item),
 *       show: canUpdate
 *     },
 *     {
 *       label: t("delete"),
 *       icon: <Trash2 className="h-4 w-4" />,
 *       onClick: (item) => handleDelete(item),
 *       show: canDelete
 *     }
 *   ]
 * })
 */
export const DataGridActionCellRenderer = <T,>(config: DataGridActionCellConfig<T>) => {
  const CellComponent = ({ row }: CellContext<T, unknown>) => {
    const item = row.original;
    const visibleActions = config.actions.filter((action) => action.show !== false);

    if (!config.showAlways && visibleActions.length === 0) {
      return null;
    }

    const alignClass =
      config.align === "left"
        ? "flex justify-start"
        : config.align === "center"
          ? "flex justify-center"
          : "flex justify-end";

    return (
      <div className={alignClass}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={config.align === "left" ? "start" : config.align === "center" ? "center" : "end"}
          >
            {visibleActions.map((action, index) => {
              const itemContent = (
                <>
                  {action.icon}
                  {action.label}
                </>
              );
              // @ts-ignore - Type conflict between React 19 RC and Radix UI
              return (
                <DropdownMenuItem
                  key={index}
                  className={action.className || "cursor-pointer"}
                  onClick={() => action.onClick(item)}
                  children={itemContent}
                />
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  CellComponent.displayName = "DataGridActionCellComponent";
  return CellComponent;
};
