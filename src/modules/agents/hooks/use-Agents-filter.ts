import { DEFAULT_PAGE } from "@/constant";
import { parseAsString, useQueryStates } from "nuqs";

export const useAgentsFilter = () => {
  return useQueryStates({
    search: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),

    page: parseAsString
      .withDefault(`${DEFAULT_PAGE}`)
      .withOptions({ clearOnDefault: true }),
  });
};
