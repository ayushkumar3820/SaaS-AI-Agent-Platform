import { DEFAULT_PAGE } from "@/constant";
import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";
import { MeetingStatus } from "./types";

export const FiltersSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

  page: parseAsString
    .withDefault(`${DEFAULT_PAGE}`)
    .withOptions({ clearOnDefault: true }),
     status: parseAsStringEnum(Object.values(MeetingStatus)),
    agentId: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
};

export const loadSearchParams=createLoader(FiltersSearchParams);
