"use client";

import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { PricingCard } from "../components/pricing-card";
import { ErrorState } from "@/components/erro-state";

// Use server-side tRPC import
import { trpc } from "@/trpc/server";

// Define proper types for the data structures
interface ProductPrice {
    amountType: string;
    priceAmount: number;
    recurringInterval: string;
}

interface ProductBenefit {
    description: string;
}

interface ProductMetadata {
    variant?: string;
    badge?: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    prices: ProductPrice[];
    benefits: ProductBenefit[];
    metadata: ProductMetadata;
}

interface Subscription {
    id: string;
    name: string;
}

export const UpgradeView = () => {
    const { data: products = [], isLoading: productsLoading } = useQuery({
        queryKey: ['premium', 'getProducts'],
        queryFn: () => trpc.premium.getProducts.query(),
    });
    
    const { data: currentSubscription = null, isLoading: subscriptionLoading } = useQuery({
        queryKey: ['premium', 'getCurrentSubscription'],
        queryFn: () => trpc.premium.getCurrentSubscription.query(),
    });

    if (productsLoading || subscriptionLoading) {
        return <UpgradeViewLoading />;
    }
    
    // Type assertion to ensure proper typing
    const typedProducts = products as Product[];
    const typedSubscription = currentSubscription as Subscription | null;
    
    return (
        <>
            <div className="flex-1 py-4 px-4">
                <div className="mt-4 flex-1">
                    <h5 className="font-medium text-xl md:text-2xl mb-6">
                        You are on the{" "}
                        <span className="text-blue-600 font-semibold">
                            {typedSubscription?.name ?? "Free"}
                        </span>{" "}
                        plan
                    </h5>
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {typedProducts.map((product: Product) => {
                            const isCurrentProduct = typedSubscription?.id === product.id;
                            const isPremium = !!typedSubscription;
                            
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
                                    variant={product.metadata?.variant === "highlighted" ? "highlighted" : "default"}
                                    title={product.name}
                                    price={product.prices?.[0]?.amountType === "fixed" ? product.prices[0].priceAmount / 100 : 0}
                                    description={product.description}
                                    priceSuffix={`/${product.prices?.[0]?.recurringInterval || "month"}`}
                                    features={product.benefits?.map((benefit: ProductBenefit) => benefit.description) || []}
                                    badge={(product.metadata?.badge as string) || null}
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