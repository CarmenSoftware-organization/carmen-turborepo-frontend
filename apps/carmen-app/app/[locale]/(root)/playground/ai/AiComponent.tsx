"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useAiGenerate } from "@/hooks/use-ai-generate";

const contextOptions = [
  { value: "product", label: "Product", placeholder: "e.g., Wireless Bluetooth Headphones" },
  { value: "blog", label: "Blog Post", placeholder: "e.g., 10 Tips for Productivity" },
  { value: "email", label: "Email", placeholder: "e.g., Follow-up meeting request" },
  { value: "commit", label: "Commit Message", placeholder: "e.g., Fixed login authentication bug" },
  { value: "social", label: "Social Media", placeholder: "e.g., New product launch announcement" },
];

export default function AiComponent() {
  const [selectedContext, setSelectedContext] = useState("product");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { generate: generateTitleApi, loading: loadingTitle, error: errorTitle } = useAiGenerate();
  const { generate: generateDescApi, loading: loadingDesc, error: errorDesc } = useAiGenerate();

  const currentOption = contextOptions.find((opt) => opt.value === selectedContext);

  const generateTitle = async () => {
    const prompts: Record<string, string> = {
      product: `Generate a creative product name. ${title ? `Based on: ${title}` : "Create a random innovative product name"}. Return ONLY the product name, nothing else.`,
      blog: `Generate a catchy blog post title. ${title ? `Topic: ${title}` : "Create an interesting blog title"}. Return ONLY the title, nothing else.`,
      email: `Generate an email subject line. ${title ? `Purpose: ${title}` : "Create a professional email subject"}. Return ONLY the subject line, nothing else.`,
      commit: `Generate a short git commit message. ${title ? `Changes: ${title}` : "General improvements"}. Return ONLY the commit message, nothing else.`,
      social: `Generate a catchy social media headline. ${title ? `Topic: ${title}` : "Create engaging headline"}. Return ONLY the headline, nothing else.`,
    };

    const result = await generateTitleApi(prompts[selectedContext]);
    if (result) setTitle(result);
  };

  const generateDescription = async () => {
    const prompts: Record<string, string> = {
      product: `Generate a product description. ${title ? `Product: ${title}` : ""}${description ? ` Details: ${description}` : ""}. Return ONLY the description, nothing else.`,
      blog: `Generate a blog intro paragraph. ${title ? `Title: ${title}` : ""}${description ? ` Details: ${description}` : ""}. Return ONLY the paragraph, nothing else.`,
      email: `Generate an email body. ${title ? `Subject: ${title}` : ""}${description ? ` Details: ${description}` : ""}. Return ONLY the email body, nothing else.`,
      commit: `Generate a detailed commit description. ${title ? `Commit: ${title}` : ""}${description ? ` Details: ${description}` : ""}. Return ONLY the description, nothing else.`,
      social: `Generate social media post content. ${title ? `Headline: ${title}` : ""}${description ? ` Details: ${description}` : ""}. Return ONLY the post content, nothing else.`,
    };

    const result = await generateDescApi(prompts[selectedContext]);
    if (result) setDescription(result);
  };

  const error = errorTitle || errorDesc;

  const GenerateButton = ({ loading, onClick }: { loading: boolean; onClick: () => void }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={loading}
      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
    </Button>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Content Generator</CardTitle>
          <CardDescription>Select a content type and generate with AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Content Type</Label>
            <div className="flex flex-wrap gap-2">
              {contextOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedContext === option.value ? "default" : "outline"}
                  onClick={() => setSelectedContext(option.value)}
                  className="h-9"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title / Name</Label>
              <div className="relative">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={currentOption?.placeholder}
                  disabled={loadingTitle}
                  className="pr-10"
                />
                <GenerateButton loading={loadingTitle} onClick={generateTitle} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <div className="relative">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details or let AI generate..."
                  rows={5}
                  disabled={loadingDesc}
                  className="resize-none pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={generateDescription}
                  disabled={loadingDesc}
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  {loadingDesc ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
