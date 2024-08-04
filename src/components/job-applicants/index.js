'use client'

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DrawerContent } from "../ui/drawer";
import {
    Drawer,
  } from "@/components/ui/drawer"
import CandidateList from "../candidate-list";

function JobApplicants({
    showApplicantsDrawer,
    setShowApplicantsDrawer,
    showCurrentCandidateDetailsModal,
    setShowCurrentCandidateDetailsModal,
    setCurrentCandidateDetails,
    currentCandidateDetails,
    jobItem,
    jobApplications
}){
    return <Drawer open={showApplicantsDrawer} onOpenChange={setShowApplicantsDrawer}>
     <DrawerContent className="max-h-[50vh]">
        <ScrollArea className="h-auto overflow-y-auto">
            <CandidateList
            currentCandidateDetails={currentCandidateDetails}
            setCurrentCandidateDetails={setCurrentCandidateDetails}
            jobApplications={jobApplications}
            showCurrenCandidateDetailsModal={showCurrentCandidateDetailsModal}
            setShowCurrentCandidateDetailsModal={setShowCurrentCandidateDetailsModal}
            />
        </ScrollArea>
     </DrawerContent>
    </Drawer>
}

export default JobApplicants;