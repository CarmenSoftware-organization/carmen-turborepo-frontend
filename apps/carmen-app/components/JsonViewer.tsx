import { useState } from "react";

export default function JsonViewer({
  data,
}: {
  data: Record<string, unknown>;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const formatJson = (obj: unknown, depth = 0): JSX.Element => {
    const indent = "  ".repeat(depth);

    if (obj === null || obj === undefined) {
      return <span className="text-blue-500">null</span>;
    }

    if (typeof obj === "string") {
      return <span className="text-orange-500">&quot;{obj}&quot;</span>;
    }

    if (typeof obj === "number") {
      return <span className="text-green-500">{String(obj)}</span>;
    }

    if (typeof obj === "boolean") {
      return <span className="text-purple-500">{String(obj)}</span>;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return <span>[]</span>;
      }

      return (
        <>
          [<br />
          {obj.map((item, index) => (
            <div key={index}>
              {indent} {formatJson(item, depth + 1)}
              {index < obj.length - 1 && ","}
              <br />
            </div>
          ))}
          {indent}]
        </>
      );
    }

    if (typeof obj === "object" && obj !== null) {
      const entries = Object.entries(obj as Record<string, unknown>);
      if (entries.length === 0) {
        return <span>{"{}"}</span>;
      }

      return (
        <>
          {"{"}
          <br />
          {entries.map(([key, value], index) => (
            <div key={key}>
              {indent} <span className="text-primary">&quot;{key}&quot;</span>:{" "}
              {formatJson(value, depth + 1)}
              {index < entries.length - 1 && ","}
              <br />
            </div>
          ))}
          {indent}
          {"}"}
        </>
      );
    }

    return <span>{String(obj)}</span>;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-primary">●</span>
            <span>Keys</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-orange-500">●</span>
            <span>String</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">●</span>
            <span>Number</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-purple-500">●</span>
            <span>Boolean</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-500">●</span>
            <span>Null</span>
          </div>
        </div>
        <button
          onClick={handleCopyToClipboard}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            isCopied
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200"
          }`}
        >
          {isCopied ? "Copied!" : "Copy JSON"}
        </button>
      </div>
      <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-auto">
        {formatJson(data)}
      </pre>
    </div>
  );
}
