"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";



export const HomeView = () => {
    const trpc=useTRPC();
    const {data}=useQuery(trpc.hello.queryOptions({text:"AyushKumar"}))
   

    return (
        <div className="flex flex-col p-4">
            {data?.greeting ?? "No greeting received"}

            
        </div>
    );
};
