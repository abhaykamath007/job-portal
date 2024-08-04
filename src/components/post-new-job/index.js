'use client'

import { Dialog, DialogHeader } from "../ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import { DialogContent, DialogTitle } from "../ui/dialog";
import CommonForm from "../ui/common-form";
import { initialpostNewJobFormData, postNewJobFormControls } from "@/utils";
import { postNewJobAction } from "@/actions";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

function PostNewJob({profileInfo,user,jobList}) {

    const [showJobDialog,setShowJobDialog] = useState(false);
    const [jobFormData,setJobFormData] = useState({
        ...initialpostNewJobFormData,
        companyName: profileInfo?.recruiterInfo?.companyName
})
    const {toast} = useToast();    

    function handlePostNewBtnValid(){
        return Object.keys(jobFormData).every((control)=>jobFormData[control] !== "");
    }

    function handleAddNewJob(){
        if(!profileInfo?.isPremiumUser && jobList?.length >=2 ){
            toast({
                varient : "destructive",
                title : "You can post max 2 jobs",
                description : "Please opt for membership to post more jobs",
            })
            return;
        }
        else if(profileInfo?.isPremiumUser && profileInfo?.memberShipType === 'basic' && jobList?.length >=5 ){
            toast({
                varient : "destructive",
                title : "You can post max 5 jobs",
                description : "Please upgrade your membership to post more jobs",
            })
            return;
        }
        else if(profileInfo?.isPremiumUser && profileInfo?.memberShipType === 'teams' && jobList?.length >=10 ){
            toast({
                varient : "destructive",
                title : "You can post max 10 jobs",
                description : "Please upgrade your membership to post more jobs",
            })
            return;
        }
        setShowJobDialog(true);
    }

    async function createNewJob(){
       await postNewJobAction({
        ...jobFormData,
        applicants : [],
        recruiterId : user?.id,    
       },'/jobs')

       setJobFormData({
        ...initialpostNewJobFormData,
        companyName : profileInfo?.recruiterInfo?.companyName,
       });
       setShowJobDialog(false);
    }

    return <div>
        <Button onClick={handleAddNewJob} className='disabled:opacity-60 flex h-11 items-center justify-center px-5'>
            Post a Job
        </Button>
        <Dialog open={showJobDialog} 
        onOpenChange={()=>{setShowJobDialog(false);
            setJobFormData({
                ...initialpostNewJobFormData,
                companyName: profileInfo?.recruiterInfo?.companyName}
            )
        }}>
            <DialogContent 
            className="sm:max-w-screen-md h-[600px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Post New Job</DialogTitle>
                    <div className="grid gap-4 py-4">
                        <CommonForm 
                        buttonText={'Add '}
                        formData={jobFormData}
                        setFormData={setJobFormData}
                        formControls={postNewJobFormControls}
                        isBtnDisabled={!handlePostNewBtnValid()}
                        action={createNewJob}
                        />
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
}

export default PostNewJob