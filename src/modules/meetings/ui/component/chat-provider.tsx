"use client";

import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { ChatUI } from "./chat-ui";

interface Props{
    meetingId:string,
    meetingName:string
}


export const ChatProvider=({meetingId,meetingName}:Props)=>{
    const {data,isPending}=authClient.useSession();
    if(!isPending || !data?.user){
        return (
            <LoadingState title="Loading..." description="please wait while we load  the chat "/>
        )
    }
    return (
        <ChatUI meetingId={meetingId} meetingName={meetingName} userId={data.user.id} userName={data.user.name} userImage={data.user.image}/>
    )

}