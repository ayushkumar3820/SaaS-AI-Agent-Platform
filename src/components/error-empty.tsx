import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";

interface Props {
  title: string;
  description: string;
  image?: string;
}

export const EmptyState = ({ 
  title, 
  description, 
  image = "/empty.svg" 
}: Props) => {
  return (
    <div className="py-4 px-8 flex flex-col items-center justify-center">
      <Image 
        src={image} 
        alt="Empty state illustration" 
        width={240} 
        height={240}
        className="mb-6"
      />
      <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm border">
        <AlertCircleIcon className="size-6 text-muted-foreground" />
        <div className="flex flex-col gap-y-2 text-center">
          <h6 className="text-sm font-medium text-foreground">{title}</h6>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
