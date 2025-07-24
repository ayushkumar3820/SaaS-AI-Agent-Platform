import { DEFAULT_PAGE } from "@/constant";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { MeetingStatus } from "../types";

export const useMeetingsFilter = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

    page: parseAsString
      .withDefault(`${DEFAULT_PAGE}`)
      .withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(MeetingStatus)),
    agentId: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
  });
};
