// // import { ResponsiveDialog } from "@/components/responsive_dialog";
// import { AgentForm } from "./agent_form";
// // import { AgentGetOne } from "../../types";
// import { useState } from "react";

// interface Props {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   initialValues:AgentGetOne;
// }

// export const UpdateAgentDialog = ({ open, onOpenChange,initialValues }: Props) => {

//   return (
//     <>
//       <ResponsiveDialog
//         title="New Agent"
//         description="Edit from  Dialog"
//         open={open}
//         onOpenChange={onOpenChange}
//       >
//      <AgentForm OnSuccess={()=>onOpenChange(false)} OnError={()=>onOpenChange(false)} initialValues={initialValues}/>
//       </ResponsiveDialog>
//     </>
//   );
// };
