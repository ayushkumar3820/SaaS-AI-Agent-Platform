// import { Button } from "@/components/ui/button";
// import { PlusIcon, XCircleIcon } from "lucide-react";
// import { NewAgentDialog } from "./newAgentDigalogs";
// import { useState } from "react";
// import { useAgentsFilter } from "../../hooks/use-Agents-filter";
// import { AgentSearchFilter } from "./agent_search_filter";
// import { DEFAULT_PAGE } from "@/constant";

// export const AgentListHeader = () => {
//   const [isDialog, setIsDialog] = useState(false);
//   const [filter, setFilter] = useAgentsFilter();

//   const isAnyFilterModified = !!filter.search;

//   const onClearFilters = () => {
//    setFilter({
//     search: "",
//     page: `${DEFAULT_PAGE}`,
// });

//   };

//   return (
//     <>
//       <NewAgentDialog open={isDialog} onOpenChange={setIsDialog} />
//       <div className="px-4 py-4 flex flex-col md:px-8 gap-y-4">
//         <div className="flex items-center justify-between">
//           <h5 className="font-medium text-2xl">My Agents</h5>
//           <Button onClick={() => setIsDialog(true)}>
//             <PlusIcon className="mr-2" />
//             New Agent
//           </Button>
//         </div>

//         <AgentSearchFilter />

//         {isAnyFilterModified && (
//           <Button
//             variant="outline"
//             className="text-sm self-start"
//             onClick={onClearFilters}
//           >
//             <XCircleIcon className="mr-1" />
//             Clear
//           </Button>
//         )}
//       </div>
//     </>
//   );
// };
