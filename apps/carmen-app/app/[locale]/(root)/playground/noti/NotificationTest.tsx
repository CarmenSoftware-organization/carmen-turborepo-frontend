"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useSendNotification } from "@/hooks/useNoti";
import { EnumNotiType } from "@/dtos/notification.dto";

export default function NotificationTest() {
  const { user, token } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<EnumNotiType>(EnumNotiType.info);

  const {
    mutate: sendNotification,
    isPending,
    isSuccess,
    isError,
    error,
  } = useSendNotification(token);

  const handleSuccess = (data: {
    id: string;
    title: string;
    message: string;
    type: EnumNotiType;
    created_at?: string;
  }) => {
    globalThis.window.dispatchEvent(
      new CustomEvent("notification-sent", {
        detail: {
          id: data.id,
          title: data.title,
          message: data.message,
          type: data.type,
          created_at: data.created_at || new Date().toISOString(),
        },
      })
    );

    setTitle("");
    setMessage("");
    setType(EnumNotiType.info);
  };

  const handleSendNotification = () => {
    if (!title || !message || !user?.data.id) return;

    sendNotification(
      {
        title,
        message,
        type,
        category: "user-to-user",
        to_user_id: user.data.id,
        from_user_id: user.data.id,
      },
      {
        onSuccess: handleSuccess,
      }
    );
  };

  const sendQuickTest = () => {
    setTitle("Test Notification");
    setMessage("This is a test notification from the playground.");
    setType(EnumNotiType.info);
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔔 Notification Playground</CardTitle>
          <CardDescription>
            Test sending notifications to yourself. The notification should appear in the bell icon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Logged in as:</span>{" "}
              {user?.data.email || "Not logged in"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">User ID: {user?.data.id || "N/A"}</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as EnumNotiType)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EnumNotiType.info}>Info</SelectItem>
                  <SelectItem value={EnumNotiType.success}>Success</SelectItem>
                  <SelectItem value={EnumNotiType.warning}>Warning</SelectItem>
                  <SelectItem value={EnumNotiType.error}>Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result Message */}
          {isSuccess && (
            <div className="p-3 rounded-lg bg-green-50 text-green-800 border border-green-200">
              <p className="text-sm font-medium">✅ Success</p>
              <p className="text-xs mt-1">
                Notification sent successfully! Check the notification bell icon.
              </p>
            </div>
          )}
          {isError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200">
              <p className="text-sm font-medium">❌ Error</p>
              <p className="text-xs mt-1">
                {error instanceof Error ? error.message : "Failed to send notification"}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSendNotification}
              disabled={isPending || !user?.data.id || !title || !message}
              className="flex-1"
            >
              {isPending ? "Sending..." : "Send Notification"}
            </Button>
            <Button onClick={sendQuickTest} variant="outline" disabled={isPending}>
              Quick Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
