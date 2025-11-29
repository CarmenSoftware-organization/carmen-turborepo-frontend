import { useState } from "react";

interface UseAiGenerateReturn {
  generate: (prompt: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
  data: string | null;
}

export function useAiGenerate(): UseAiGenerateReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  const generate = async (prompt: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const result = await res.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result.text);
      return result.text;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, data };
}
