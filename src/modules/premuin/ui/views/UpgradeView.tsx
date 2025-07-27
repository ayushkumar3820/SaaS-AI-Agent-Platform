
import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { PricingCard } from "../components/pricing-card";
import { ErrorState } from "@/components/erro-state";

export const UpgradeView = () => {
    const trpc = useTRPC();
    const { data: products } = useSuspenseQuery(trpc.premium.getProducts.queryOptions());
    const { data: currentSubscription } = useSuspenseQuery(trpc.premium.getCurrentSubscription.queryOptions());

    return (
        <>
            <div className="flex-1 py-4 px-4">
                <div className="mt-4 flex-1">
                    <h5 className="font-medium text-xl md:text-2xl mb-6">
                        You are on the{" "}
                        <span className="text-blue-600 font-semibold">
                            {currentSubscription?.name ?? "Free"}
                        </span>{" "}
                        plan
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((product) => {
                            const isCurrentProduct = currentSubscription?.id === product.id;
                            const isPremium = !!currentSubscription;

                            let buttonText = "Upgrade";
                            let onClick = () => authClient.checkout({
                                products: [product.id]
                            });

                            if (isCurrentProduct) {
                                buttonText = "Manage";
                                onClick = () => authClient.customer.portal();
                            } else if (isPremium) {
                                buttonText = "Change Plan";
                                onClick = () => authClient.customer.portal();
                            }

                            return (
                                <PricingCard 
                                    key={product.id} 
                                    buttonText={buttonText}  
                                    onClick={onClick} 
                                    variant={product.metadata.variant === "highlighted" ? "highlighted" : "default"}
                                    title={product.name}
                                    price={product.prices[0].amountType === "fixed" ? product.prices[0].priceAmount / 100 : 0}
                                    description={product.description}
                                    priceSuffix={`/${product.prices[0].recurringInterval}`}
                                    features={product.benefits.map((benefit) => benefit.description)}
                                    badge={product.metadata.badge as string | null} 
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export const UpgradeViewLoading = () => {
    return (
        <LoadingState 
            title="Loading Plans" 
            description="Please wait while we load your subscription options..." 
        />
    );
};

export const UpgradeViewError = () => {
    return (
        <ErrorState 
            title="Failed to Load Plans" 
            description="We couldn't load your subscription options. Please try again later." 
        />
    );
};
