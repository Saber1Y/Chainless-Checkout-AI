"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  tokenId: string;
  metadata: {
    name: string;
    description: string;
    attributes?: { trait_type: string; value: string }[];
  };
}

export function AccessPassCard({ tokenId, metadata }: Props) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{metadata.name}</span>
          <Badge variant="secondary">#{tokenId}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="aspect-square w-full max-w-[200px] mx-auto rounded-lg bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-3xl font-bold">CAP</p>
            <p className="text-xs opacity-80">Access Pass</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          {metadata.description}
        </p>
        {metadata.attributes && (
          <div className="flex flex-wrap gap-1 justify-center">
            {metadata.attributes.map((attr, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {attr.trait_type}: {attr.value}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
