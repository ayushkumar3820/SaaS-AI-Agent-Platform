// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
// } from "@radix-ui/react-dropdown-menu";
// import { ChevronRightIcon, MoreVertical, PencilIcon, TrashIcon } from "lucide-react";
// import Link from "next/link";

// interface Props {
//   agentId: string;
//   agentName: string;
//   onEdit: () => void;
//   onRemove: () => void;
// }

// export const AgentIdViewHeader = ({
//   agentId,
//   agentName,
//   onEdit,
//   onRemove,
// }: Props) => {
//   return (
//     <>
//       <div className="flex item-center justify-between">
//         <Breadcrumb>
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbLink asChild className="font-medium text-sm">
//                 <Link href="/agents">My Agents</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator className="text-foreground text-xl  font-medium [&>svg]:size-4">
//               <ChevronRightIcon />
//             </BreadcrumbSeparator>
//             <BreadcrumbItem>
//               <BreadcrumbLink asChild className="font-medium text-lg">
//                 <Link href={`/agents/${agentId}`}>{agentName}</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost">
//               <MoreVertical />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={onEdit}>
//               <PencilIcon className="size-4 text-black">Edit</PencilIcon>
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={onRemove}>
//               <TrashIcon className="size-4 text-black">Delete</TrashIcon>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </>
//   );
// };
