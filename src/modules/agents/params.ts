import { DEFAULT_PAGE } from "@/constant";
import { createLoader, parseAsString } from "nuqs/server";

export const FiltersSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

  page: parseAsString
    .withDefault(`${DEFAULT_PAGE}`)
    .withOptions({ clearOnDefault: true }),
};

export const loadSearchParams=createLoader(FiltersSearchParams);
