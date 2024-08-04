'use client'
import { Fragment } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { getCandidateDetailsByIDAction, updateJobApplicationAction } from "@/actions"
import { createClient } from "@supabase/supabase-js"

const supabaseClient = createClient('https://wnjyyvhnywxdypxfzzit.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Induanl5dmhueXd4ZHlweGZ6eml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNjIyNzMsImV4cCI6MjAzNzgzODI3M30.Dgv2QU-Jn9lpRlx1boi3dJJPGkaJyaTta2HnHc2ZszY');

const CandidateList = ({ jobApplications,
    currentCandidateDetails,
    setCurrentCandidateDetails,
    showCurrenCandidateDetailsModal,
    setShowCurrentCandidateDetailsModal }) => {

    async function handleFetchCandidateDetails(getCurrentCandidateId){
        const data = await getCandidateDetailsByIDAction(getCurrentCandidateId);
        
        if(data){
            setCurrentCandidateDetails(data);
            setShowCurrentCandidateDetailsModal(true);
        }
        console.log(data);
    }

    function handlePreviewResume(){
        const {data} = supabaseClient.storage.from('job-board-public').getPublicUrl(currentCandidateDetails?.candidateInfo?.resume);
        
        const a = document.createElement('a');
        a.href = data?.publicUrl;
        a.setAttribute('download','Resume.pdf');
        a.setAttribute('target','_blank');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async function handleUpdateJobStatus(getCurrentStatus){
        let copyJobApplicants = [...jobApplications];
        const indexOfCurrentJobApplicant = copyJobApplicants.findIndex(item=> item.candidateUserID === currentCandidateDetails?.userId);
        const jobApplicantsToUpdate = {
            ...copyJobApplicants[indexOfCurrentJobApplicant],
            status: copyJobApplicants[indexOfCurrentJobApplicant].status.concat(getCurrentStatus)
        }
        await updateJobApplicationAction(jobApplicantsToUpdate,"/jobs");
    }

    return (
        <Fragment>
            <div className="grid grid-cols-1 gap-3 p-10 md:grid-cols-2 lg:grid-cols-3">
                {
                    jobApplications && jobApplications.length > 0 ?
                        jobApplications.map(jobApplicantItem => <div className="bg-white shadow-lg w-full max-w-sm rounded-lg overflow-hidden mx-auto mt-4">
                            <div className="px-4 my-6 flex justify-between items-center">
                                <h3 className="text-lg font-bold">{jobApplicantItem?.name}</h3>
                                <Button onClick={()=>handleFetchCandidateDetails(jobApplicantItem?.candidateUserID)} className="flex h-11 items-center justify-center px-5"
                                >
                                    View Profile
                                </Button>
                            </div>
                        </div>)
                        : null
                }
            </div>
            <Dialog open={showCurrenCandidateDetailsModal}
            onOpenChange={()=>{
                setCurrentCandidateDetails(null)
                setShowCurrentCandidateDetailsModal(false)}}>
            <DialogContent>
                <div>
                    <h1 className="text-xl font-bold">
                    {currentCandidateDetails?.candidateInfo?.name},{" "}
                        {currentCandidateDetails?.email}
                    </h1>
                    <p className="text-xl font-medium text-black">{currentCandidateDetails?.candidateInfo?.currentCompany}</p>
                    <p className="text-sm font-normal text-black">{currentCandidateDetails?.candidateInfo?.currentJobLocation}</p>
                    <p>Total Experience : {currentCandidateDetails?.candidateInfo?.totalExperience}{" "}Years</p>
                    <p>{currentCandidateDetails?.candidateInfo?.currentSalary}{" "}LPA</p>
                    <p>Notice Period : {currentCandidateDetails?.candidateInfo?.noticePeriod}{" "}Days</p>       
                    <div className="flex flex-wrap gap-4 mt-6">
                        {   
                            currentCandidateDetails?.candidateInfo?.skills?.split(",").map((skillItem) => (
                                <div className="w-[100px] flex justify-center items-center h-[35px] bg-black rounded-[4px]">
                                    <h2 className="text-[13px] font-medium text-white">
                                        {skillItem}
                                    </h2>
                                </div>
                            ))
                        }
                    </div>               
                <div className="flex flex-wrap items-center gap-4 mt-6">
                        <h1>Previous Companies</h1>
                        {   
                            currentCandidateDetails?.candidateInfo?.previousCompanies.split(",").map((skillItem) => (
                                <div className="w-[100px] flex justify-center items-center h-[35px] bg-black rounded-[4px]">
                                    <h2 className="text-[13px] font-medium text-white">
                                        {skillItem}
                                    </h2>
                                </div>
                            ))
                        }
                    </div>               
                </div>
                <DialogFooter>
                <div className="flex gap-3">
            <Button
              onClick={handlePreviewResume}
              className=" flex h-11 items-center justify-center px-5"
            >
              Resume
            </Button>
            <Button
              onClick={() => handleUpdateJobStatus("selected")}
              className=" disabled:opacity-65 flex h-11 items-center justify-center px-5"
              disabled={
                jobApplications
                  .find(
                    (item) =>
                      item.candidateUserID === currentCandidateDetails?.userId
                  )
                  ?.status.includes("selected") ||
                jobApplications
                  .find(
                    (item) =>
                      item.candidateUserID === currentCandidateDetails?.userId
                  )
                  ?.status.includes("rejected")
                  ? true
                  : false
              }
            >
              {jobApplications
                .find(
                  (item) =>
                    item.candidateUserID === currentCandidateDetails?.userId
                )
                ?.status.includes("selected")
                ? "Selected"
                : "Select"}
            </Button>
            <Button
              onClick={() => handleUpdateJobStatus("rejected")}
              className=" disabled:opacity-65 flex h-11 items-center justify-center px-5"
              disabled={
                jobApplications
                  .find(
                    (item) =>
                      item.candidateUserID === currentCandidateDetails?.userId
                  )
                  ?.status.includes("selected") ||
                jobApplications
                  .find(
                    (item) =>
                      item.candidateUserID === currentCandidateDetails?.userId
                  )
                  ?.status.includes("rejected")
                  ? true
                  : false
              }
            >
              {jobApplications
                .find(
                  (item) =>
                    item.candidateUserID === currentCandidateDetails?.userId
                )
                ?.status.includes("rejected")
                ? "Rejected"
                : "Reject"}
            </Button>
          </div>
            </DialogFooter>
            </DialogContent>
            
            </Dialog>
        </Fragment>
    )
}

export default CandidateList
