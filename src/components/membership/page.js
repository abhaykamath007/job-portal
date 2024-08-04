'use client'

import { membershipPlans } from "@/utils"
import CommonCard from "../common-card"
import JobIcon from "../job-icon"
import { Button } from "../ui/button"
import { createPriceIdAction, createStripePaymentAction, updateProfileAction } from "@/actions"
import { loadStripe } from "@stripe/stripe-js"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

const stripePromise = loadStripe("pk_test_51Pjwel2LB4fWXFbwgsS0IHxBgCgf6KS8zadYL7JFAQS83WG3xzoa2ut7HptaVddc6yBNX15EEfmpBLBfaZx66Ekf0066UTPhDz")

const Membership = ({ profileInfo }) => {

    const pathName = useSearchParams();

    async function handlePayment(getCurrentPlan) {
        const stripe = await stripePromise
        const extractPriceId = await createPriceIdAction({
            amount: Number(getCurrentPlan?.price)
        });

        if (extractPriceId) {
            sessionStorage.setItem('currentPlan', JSON.stringify(getCurrentPlan))
            const result = await createStripePaymentAction({
                lineItems: [
                    {
                        price: extractPriceId?.id,
                        quantity: 1
                    }
                ]
            });

            await stripe.redirectToCheckout({
                sessionId: result?.id
            })
        }
    }

    async function updateProfile() {
        const fetchCurrentPlanFromSessionStorage = JSON.parse(sessionStorage.getItem('currentPlan'));

        await updateProfileAction({
            ...profileInfo,
            isPremiumUser: true,
            memberShipType: fetchCurrentPlanFromSessionStorage?.type,
            memberShipStartDate: new Date().toString(),
            memberShipEndDate: new Date(
                new Date().getFullYear() + fetchCurrentPlanFromSessionStorage?.type === 'basic' ? 1 :
                    fetchCurrentPlanFromSessionStorage?.plan === 'teams' ? 2 : 5,
                new Date().getMonth(),
                new Date().getDay()
            )
        }, '/membership')
    }

    useEffect(() => {
        if (pathName.get('status') === "success") updateProfile();
    }, [pathName])

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex items-baseline justify-between border-b pb-6 pt-24">
                <h1 className="text-4xl font-bold tracking-tight text-gray-950">
                    {console.log(profileInfo?.isPremiumUser)
                    }
                    {
                        profileInfo?.isPremiumUser ? 'You are a premium user'
                            : "Choose Your Best Plan"
                    }
                </h1>
                <div>
                    {
                        profileInfo?.isPremiumUser ?
                            <Button className="disabled:opacity-65 flex h-11 items-center justify-center">
                                {
                                    membershipPlans.find(planItem => planItem.type === profileInfo?.memberShipType).heading
                                }
                            </Button> : null
                    }
                </div>
            </div>
            <div className="py-20 pb-24 pt-6">
                <div className="container mx-auto p-0 space-y-8">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                        {
                            membershipPlans.map((plan, index) => <CommonCard
                                icon={
                                    <div className="flex justify-between">
                                        <div>
                                            <JobIcon />
                                        </div>
                                        <h1 className="font-bold text-2xl">{plan.heading}</h1>
                                    </div>
                                }
                                title={`Rs ${plan.price} /yr`}
                                description={plan.type === 'basic' ? plan.type + '   (upto 5 applies or posts)' : plan.type === 'teams' ? plan.type + '   (upto 10 applies or posts)' : plan.type + '   (unlimited applies and posts)'}
                                footerContent={
                                    profileInfo?.memberShipType === 'enterprise' || (
                                        profileInfo?.memberShipType === 'basic' && index === 0
                                    ) || (
                                        profileInfo?.memberShipType === 'teams' && index >= 0 && index < 2 ? null : (
                                            <Button onClick={() => handlePayment(plan)} className="disabled:opacity-65 flex h-11 items-center justify-center">
                                                {
                                                    profileInfo?.memberShipType === 'basic' || 
                                                    profileInfo?.memberShipType === 'teams' 
                                                    ? "Update Plan" 
                                                    : "Get Premium"
                                                }
                                            </Button>
                                        )
                                    )

                                }
                            />)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Membership
