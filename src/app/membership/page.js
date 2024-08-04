import { fetchProfileAction } from "@/actions";
import Membership from "@/components/membership/page";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function MembershipPage(){

    const user = await currentUser();
    const profileInfo = await fetchProfileAction(user?.id);
    if(!profileInfo)redirect("/onboard");

    return <Membership profileInfo={profileInfo}/>
}

export default MembershipPage;