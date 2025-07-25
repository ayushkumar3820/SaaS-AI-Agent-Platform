import {StreamClient} from "@stream-io/node-sdk"


export const streamVideo=new StreamClient(
    process.env.NEXT_PUBLIC_VIDEO_STEAM_URL!,
    process.env.NEXT_PUBLIC_STREAM_URL_SECRET!

)