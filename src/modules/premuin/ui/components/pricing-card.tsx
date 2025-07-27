import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { CircleCheckIcon } from "lucide-react";

const pricingCardVariant = cva("rounded-lg p-4 py-6 w-full", {
    variants: {
        variant: {
            default: "border border-gray-200 bg-white",
            highlighted: "border-2 border-blue-500 bg-blue-50 relative"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});

const pricingCardIconVariant = cva("size-5", {
    variants: {
        variant: {
            default: "fill-primary text-white",
            highlighted: "fill-white text-black"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});

const pricingCardSecondaryTextVariant = cva("text-neutral-700", {
    variants: {
        variant: {
            default: "text-neutral-700",
            highlighted: "text-neutral-700"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});

const pricingCardBadgeVariant = cva("px-2 py-1 text-xs rounded", {
    variants: {
        variant: {
            default: "bg-primary text-white",
            highlighted: "bg-white text-black"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});

interface Props extends VariantProps<typeof pricingCardVariant> {
    badge?: string | null;
    price: number;
    features: string[];
    title: string;
    description?: string | null;
    priceSuffix: string;
    className?: string;
    buttonText: string;
    onClick: () => void;
}

export const PricingCard = ({
    variant,
    badge,
    price,
    features,
    title,
    description,
    priceSuffix,
    className,
    buttonText,
    onClick
}: Props) => {
    return (
        <div className={cn(pricingCardVariant({ variant }), className)}>
            <div className="flex items-end gap-x-4 justify-between">
                <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-3">
                        <h6 className="text-xl">{title}</h6>
                        {badge ? (
                            <Badge className={cn(pricingCardBadgeVariant({ variant }))}>{badge}</Badge>
                        ) : null}
                    </div>
                    <p className={cn("text-sm", pricingCardSecondaryTextVariant({ variant }))}>{description}</p>
                </div>
                <div className="flex items-end shrink-0 gap-x-1">
                    <h4 className="text-3xl font-medium">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                        }).format(price)}
                    </h4>
                    <span className={cn(pricingCardSecondaryTextVariant({ variant }))}>{priceSuffix}</span>
                </div>
            </div>

            <div className="py-6">
                <Separator className="opacity-10" />
            </div>

            <Button 
                className="w-full mb-4" 
                size="lg" 
                variant={variant === "highlighted" ? "default" : "outline"} 
                onClick={onClick}
            >
                {buttonText}
            </Button>

            <div className="flex flex-col gap-y-2">
                <p className="font-medium">Features</p>
                <ul className={cn("space-y-2", pricingCardSecondaryTextVariant({ variant }))}>
                    {features?.map((feature, index) => (
                        <li key={index} className="flex items-center gap-x-2">
                            <CircleCheckIcon className={cn(pricingCardIconVariant({ variant }))} />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export { pricingCardVariant, pricingCardIconVariant, pricingCardSecondaryTextVariant, pricingCardBadgeVariant };
