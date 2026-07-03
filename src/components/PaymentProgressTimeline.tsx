"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";

const DEFAULT_STEPS = [
  { label: "Magic wallet connected", status: "pending" },
  { label: "Universal Account active", status: "pending" },
  { label: "Source balance found", status: "pending" },
  { label: "Moving value with Particle UA", status: "pending" },
  { label: "Finalizing purchase on Arbitrum", status: "pending" },
  { label: "Minting access pass", status: "pending" },
];

interface Props {
  onComplete?: () => void;
}

export function PaymentProgressTimeline({ onComplete }: Props) {
  const { progressSteps, setProgressSteps, updateStepStatus } = useStore();

  useEffect(() => {
    setProgressSteps(DEFAULT_STEPS);
  }, []);

  useEffect(() => {
    if (!progressSteps.length) return;
    const allDone = progressSteps.every((s) => s.status === "completed");
    if (allDone && onComplete) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [progressSteps, onComplete]);

  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {progressSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {step.status === "completed" ? (
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                ) : step.status === "in_progress" ? (
                  <div className="h-6 w-6 rounded-full border-2 border-blue-500 animate-pulse flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  </div>
                ) : step.status === "failed" ? (
                  <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs">✕</span>
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-muted" />
                )}
              </div>
              <span
                className={`text-sm ${
                  step.status === "completed"
                    ? "text-green-600 line-through"
                    : step.status === "in_progress"
                    ? "text-blue-600 font-medium"
                    : step.status === "failed"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
