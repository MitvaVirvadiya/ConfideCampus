import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth"
import dbConnect from "@/lib/dbConnection";
import mongoose from "mongoose";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }
    
    const userId = user._id
    const { acceptMessage } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessage },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update accepting message status"
                },
                { status: 400 }
            ) 
        }

        return Response.json(
            {
                success: true,
                message: "user message accepting status changed successfully "
            },
            { status: 200 }
        ) 
    } catch (error) {
        console.error('Error while Toggling accept messages', error);
        return Response.json(
            {
                success: false,
                message: "Error Toggling accept messages"
            },
            { status: 400 }
        )
    }
}

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }
    
    const userId = user._id
    try {
        const User = await UserModel.findById(userId)

        if (!User) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 400 }
            ) 
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessage: User.isAcceptingMessage 
            },
            { status: 200 }
        ) 
    } catch (error) {
        console.error('Error while fetching accept messages status', error);
        return Response.json(
            {
                success: false,
                message: "Error fetching accept messages status"
            },
            { status: 400 }
        )
    }
}