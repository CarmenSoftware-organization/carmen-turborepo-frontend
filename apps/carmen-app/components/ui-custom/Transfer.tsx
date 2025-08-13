import { useMemo, useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { TransferItem } from "@/dtos/config.dto";
import { getDisplayText } from "@/utils/helper";
import { useTranslations } from "next-intl";
export interface TransferProps {
  dataSource: TransferItem[];
  leftDataSource?: TransferItem[];
  targetKeys: (string | number)[];
  selectedKeys?: (string | number)[];
  onChange?: (
    targetKeys: (string | number)[],
    direction: "left" | "right",
    moveKeys: (string | number)[]
  ) => void;
  onSelectChange?: (
    sourceSelectedKeys: (string | number)[],
    targetSelectedKeys: (string | number)[]
  ) => void;
  render?: (item: TransferItem) => React.ReactNode;
  leftRender?: (item: TransferItem) => React.ReactNode;
  rightRender?: (item: TransferItem) => React.ReactNode;
  titles?: [React.ReactNode, React.ReactNode];
  showSearch?: boolean;
  disabled?: boolean;
  operations?: [string, string];
  listStyle?:
  | React.CSSProperties
  | ((args: { direction: "left" | "right" }) => React.CSSProperties);
  footer?: (props: { direction: "left" | "right" }) => React.ReactNode;
  showSelectAll?: boolean;
  pagination?: boolean | { pageSize: number };
}

export const Transfer: React.FC<TransferProps> = ({
  dataSource,
  leftDataSource,
  targetKeys,
  selectedKeys = [],
  onChange,
  onSelectChange,
  render,
  leftRender,
  rightRender,
  titles = ["Source", "Target"],
  showSearch = false,
  disabled = false,
  operations = [">", "<"],
  listStyle,
  footer,
  showSelectAll = true,
  pagination = false,
}) => {
  const tDataControls = useTranslations("DataControls");
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState<
    (string | number)[]
  >(() =>
    selectedKeys.filter((key: string | number) => !targetKeys.includes(key))
  );
  const [targetSelectedKeys, setTargetSelectedKeys] = useState<
    (string | number)[]
  >(() =>
    selectedKeys.filter((key: string | number) => targetKeys.includes(key))
  );
  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const [sourcePage, setSourcePage] = useState(1);
  const [targetPage, setTargetPage] = useState(1);

  const pageSize = typeof pagination === "object" ? pagination.pageSize : 10;

  // Helper function to get display text from item


  // รวมข้อมูลทั้งหมดเพื่อใช้ในการแสดงผล
  const allItems = useMemo(() => {
    const safeDataSource = Array.isArray(dataSource) ? dataSource : [];
    const safeLeftDataSource = Array.isArray(leftDataSource)
      ? leftDataSource
      : [];

    if (leftDataSource) {
      // ถ้ามี leftDataSource ให้รวมกับ dataSource
      return [...safeLeftDataSource, ...safeDataSource];
    }
    return safeDataSource;
  }, [leftDataSource, dataSource]);

  const sourceItems = useMemo(
    () => allItems.filter((item) => !targetKeys.includes(item.key)),
    [allItems, targetKeys]
  );

  const targetItems = useMemo(
    () => allItems.filter((item) => targetKeys.includes(item.key)),
    [allItems, targetKeys]
  );

  const filteredSourceItems = sourceItems.filter((item) =>
    getDisplayText(item).toLowerCase().includes(sourceSearch.toLowerCase())
  );

  const filteredTargetItems = targetItems.filter((item) =>
    getDisplayText(item).toLowerCase().includes(targetSearch.toLowerCase())
  );

  const paginatedItems = (items: TransferItem[], page: number) => {
    if (!pagination) return items;
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  };

  const moveTo = (direction: "right" | "left") => {
    const moveKeys =
      direction === "right" ? sourceSelectedKeys : targetSelectedKeys;
    const newTargetKeys =
      direction === "right"
        ? [...targetKeys, ...moveKeys]
        : targetKeys.filter((key) => !moveKeys.includes(key));

    onChange?.(newTargetKeys, direction, moveKeys);
    setSourceSelectedKeys([]);
    setTargetSelectedKeys([]);
    onSelectChange?.([], []);
  };

  const handleSelect = (
    key: string | number,
    selected: boolean,
    direction: "left" | "right"
  ) => {
    const setKeys =
      direction === "left" ? setTargetSelectedKeys : setSourceSelectedKeys;
    const prevKeys =
      direction === "left" ? targetSelectedKeys : sourceSelectedKeys;
    const newKeys = selected
      ? [...prevKeys, key]
      : prevKeys.filter((k) => k !== key);

    setKeys(newKeys);
    onSelectChange?.(
      direction === "left" ? sourceSelectedKeys : newKeys,
      direction === "left" ? newKeys : targetSelectedKeys
    );
  };

  const handleSelectAll = (
    items: TransferItem[],
    selected: boolean,
    direction: "left" | "right"
  ) => {
    const selectableKeys = items.filter((i) => !i.disabled).map((i) => i.key);
    const setKeys =
      direction === "left" ? setTargetSelectedKeys : setSourceSelectedKeys;
    const newKeys = selected ? selectableKeys : [];
    setKeys(newKeys);
    onSelectChange?.(
      direction === "left" ? sourceSelectedKeys : newKeys,
      direction === "left" ? newKeys : targetSelectedKeys
    );
  };

  const renderList = (
    items: TransferItem[],
    selected: (string | number)[],
    direction: "left" | "right",
    page: number,
    setPage: (page: number) => void,
    search: string,
    setSearch: (value: string) => void
  ) => {
    const style =
      typeof listStyle === "function" ? listStyle({ direction }) : listStyle;
    const paginated = paginatedItems(items, page);
    const totalPages = Math.ceil(items.length / pageSize);

    return (
      <Card className="w-full h-52 overflow-auto p-4" style={style}>
        {showSearch && (
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
        )}

        {showSelectAll && items.length > 0 && (
          <div className="mb-2 fxr-c gap-2">
            <Checkbox
              checked={
                selected.length === items.filter((i) => !i.disabled).length
              }
              onCheckedChange={(checked) =>
                handleSelectAll(items, Boolean(checked), direction)
              }
              disabled={disabled}
            />
            <span className="text-muted-foreground">{tDataControls("select_all")}</span>
          </div>
        )}

        <div className="space-y-1">
          {paginated.map((item) => (
            <div key={item.key} className="fxr-c space-x-2">
              <Checkbox
                checked={selected.includes(item.key)}
                onCheckedChange={(checked) =>
                  handleSelect(item.key, Boolean(checked), direction)
                }
                disabled={disabled || item.disabled}
              />
              <div className="w-full">
                {direction === "left" && leftRender
                  ? leftRender(item)
                  : direction === "right" && rightRender
                    ? rightRender(item)
                    : render
                      ? render(item)
                      : item.title}
              </div>
            </div>
          ))}
          {paginated.length === 0 && (
            <div className="text-muted-foreground">{tDataControls("data_not_found")}</div>
          )}
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex justify-between mt-2 text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <span>
              Page {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {footer && <div className="mt-2">{footer({ direction })}</div>}
      </Card>
    );
  };

  return (
    <div className="flex space-x-4 w-full">
      <div className="flex-1">
        <div className="mb-2 font-semibold">{titles[0]}</div>
        {renderList(
          filteredTargetItems,
          targetSelectedKeys,
          "left",
          targetPage,
          setTargetPage,
          targetSearch,
          setTargetSearch
        )}
      </div>

      <div className="flex flex-col justify-center space-y-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => moveTo("right")} // move source → target
          disabled={disabled || sourceSelectedKeys.length === 0}
        >
          {operations[0]} {/* → */}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => moveTo("left")} // move target → source
          disabled={disabled || targetSelectedKeys.length === 0}
        >
          {operations[1]} {/* ← */}
        </Button>
      </div>

      <div className="flex-1">
        <div className="mb-2 font-semibold">{titles[1]}</div>
        {renderList(
          filteredSourceItems,
          sourceSelectedKeys,
          "right",
          sourcePage,
          setSourcePage,
          sourceSearch,
          setSourceSearch
        )}
      </div>
    </div>
  );
};
