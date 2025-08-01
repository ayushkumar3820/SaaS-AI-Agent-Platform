import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateAvatarUri } from "@/lib/avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import Highlighter from "react-highlight-words";

interface Props {
    meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.meeting.getTranscript.queryOptions({ id: meetingId }));
    const [searchQuery, setSearchQuery] = useState("");
    
    const filteredData = (data ?? []).filter((item) => {
        return item.text.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <>
            <div className="bg-white rounded-lg border px-4 py-5 flex flex-col gap-y-4 w-full">
                <p className="text-sm font-medium">Transcript</p>
                <div className="relative">
                    <Input 
                        placeholder="Search transcript" 
                        className="pl-7 h-9 w-[240px]"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
                <ScrollArea>
                    <div className="flex flex-col gap-y-4">
                        {filteredData.map((item, index) => {
                            return (
                                <div 
                                    key={item.start_time || index}
                                    className="flex flex-col gap-y-2 hover:bg-muted p-4 rounded-md border"
                                >
                                    <div className="flex gap-x-2 items-center">
                                        <Avatar className="size-6">
                                            <AvatarImage 
                                                src={item.user.image ?? generateAvatarUri({ 
                                                    seed: item.user.name, 
                                                    variant: "initials" 
                                                })} 
                                                alt="User Avatar"
                                            />
                                        </Avatar>
                                        <p className="text-sm font-medium">{item.user.name}</p>
                                        <p className="text-sm text-blue-700 font-medium">
                                            {format(new Date(item.start_time * 1000), "mm:ss")}
                                        </p>
                                    </div>
                                    <Highlighter
                                        className="text-sm text-neutral-700"
                                        highlightClassName="bg-yellow-200"
                                        autoEscape={true}
                                        searchWords={[searchQuery]}
                                        textToHighlight={item.text}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
        </>
    );
};
