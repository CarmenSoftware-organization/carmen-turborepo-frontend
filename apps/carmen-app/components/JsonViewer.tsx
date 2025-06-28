export default function JsonViewer({
  data,
}: {
  data: Record<string, unknown>;
}) {
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
              {indent} <span className="text-blue-700">&quot;{key}&quot;</span>:{" "}
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
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-blue-500">●</span>
          <span>Keys</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-500">●</span>
          <span>String</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-purple-500">●</span>
          <span>Number</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-orange-500">●</span>
          <span>Boolean</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-red-500">●</span>
          <span>Null</span>
        </div>
      </div>
      <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-auto">
        {formatJson(data)}
      </pre>
    </div>
  );
}
