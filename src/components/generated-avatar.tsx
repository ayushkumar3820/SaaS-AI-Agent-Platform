import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant?: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
  seed,
  className,
  variant = "botttsNeutral",
}: GeneratedAvatarProps) => {
  const avatar = useMemo(() => {
    if (variant === "botttsNeutral") {
      return createAvatar(botttsNeutral, { seed });
    } else if (variant === "initials") {
      return createAvatar(initials, { 
        seed, 
        fontWeight: 500, 
        fontSize: 32 
      });
    } else {
      throw new Error(`Invalid variant: ${variant}`);
    }
  }, [seed, variant]);

  const fallbackText = seed ? seed.charAt(0).toUpperCase() : "?";

  return (
    <Avatar className={cn("h-10 w-10", className)}>
      <AvatarImage 
        src={avatar.toDataUri()} 
        alt={`Generated avatar for ${seed}`} 
      />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
};
