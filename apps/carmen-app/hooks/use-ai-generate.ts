import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface UseAiGenerateReturn {
  generate: (prompt: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
  data: string | null;
}

export function useAiGenerate(): UseAiGenerateReturn {
  const { token } = useAuth();

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const { data } = await axios.post(
        "/api/generate",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.text;
    },
  });

  const generate = async (prompt: string): Promise<string | null> => {
    try {
      return await mutation.mutateAsync(prompt);
    } catch (error) {
      console.error("AI Generation Error:", error);
      return null;
    }
  };

  return {
    generate,
    loading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
    data: mutation.data ?? null,
  };
}
