import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
};

const initials = (name: unknown) => {
  if (typeof name !== "string" || !name) return "";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export function TestimonialCard({ quote, author, role, avatarUrl }: Props) {
  return (
    <Card className="h-full min-w-[280px] gap-4 p-6">
      <CardContent className="px-0 text-base leading-relaxed text-foreground">
        {quote as unknown as React.ReactNode}
      </CardContent>
      <CardHeader className="flex flex-row items-center gap-3 px-0">
        <Avatar className="size-10">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={author} /> : null}
          <AvatarFallback className="text-xs font-medium">
            {initials(author)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {author}
          </span>
          <span className="text-xs text-muted-foreground">{role}</span>
        </div>
      </CardHeader>
    </Card>
  );
}
