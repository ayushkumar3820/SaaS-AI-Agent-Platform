import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

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
  let avatar;

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, { seed });
  } else if (variant === "initials") {
    avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 32 });
  } else {
    throw new Error("Invalid variant");
  }

  return (
    <Avatar className={cn("h-10 w-10", className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Generated Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
