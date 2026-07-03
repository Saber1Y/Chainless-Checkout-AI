"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store";
import type { BuilderKit } from "@/types";

export function AIBuilderKitGenerator() {
  const [goal, setGoal] = useState("");
  const [kit, setKit] = useState<BuilderKit | null>(null);
  const [loading, setLoading] = useState(false);
  const { setError } = useStore();

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/generate-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      setKit(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Builder Kit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!kit ? (
            <>
              <p className="text-sm text-muted-foreground">
                What are you building?
              </p>
              <Input
                placeholder="A chain-abstracted payment app for creators"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <Button
                onClick={handleGenerate}
                disabled={loading || !goal.trim()}
                className="w-full"
              >
                {loading ? "Generating..." : "Generate My Builder Kit"}
              </Button>
            </>
          ) : loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : null}
        </CardContent>
      </Card>

      {kit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your UXMaxx Builder Kit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-1">
                Project positioning
              </h3>
              <p className="text-sm text-muted-foreground">
                {kit.projectPositioning}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Best demo flow</h3>
              <ol className="space-y-1">
                {kit.bestDemoFlow.map((step, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="font-medium text-foreground">
                      {i + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-1">Recommended pitch</h3>
              <p className="text-sm text-muted-foreground">
                {kit.recommendedPitch}
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Technical checklist
                </h3>
                <ul className="space-y-1">
                  {kit.technicalChecklist.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex gap-2"
                    >
                      <span className="text-green-500">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">UI checklist</h3>
                <ul className="space-y-1">
                  {kit.uiChecklist.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex gap-2"
                    >
                      <span className="text-green-500">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
