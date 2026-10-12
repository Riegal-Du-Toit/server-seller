import { Check, Server } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = ["Managed deployment", "Weekly optimization", "Security hardening", "Migration support"];

export function PricingCard() {
  return (
    <Card className="max-w-md border-slate-200 bg-white/95">
      <CardHeader>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
          <Server className="h-5 w-5" />
        </div>
        <CardTitle>Launch Stack</CardTitle>
        <p className="text-sm text-muted-foreground">Production server setup for founders that need uptime fast.</p>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-end gap-2">
          <span className="text-4xl font-semibold">$499</span>
          <span className="pb-1 text-sm text-muted-foreground">one-time</span>
        </div>
        <ul className="mb-6 space-y-3 text-sm">
          {features.map((feature) => (
            <li className="flex items-center gap-2" key={feature}>
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full">Book setup</Button>
      </CardContent>
    </Card>
  );
}
