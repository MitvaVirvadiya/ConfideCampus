import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth"
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User.model";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    const messageId = params.messageid
    
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
    
    try {
        
        const updatedUser = await UserModel.updateOne(
            { _id: user._id },
            { $pull: {messages: {_id: messageId}}}
        )

        if(updatedUser.modifiedCount == 0){
            return Response.json(
                {
                    success: false,
                    message: "Deleting messages failed"
                },
                { status: 400 }
            )    
        }

        return Response.json(
            {
                success: true,
                message: "Message Deleted successfully"
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error while deleting messages', error);
        return Response.json(
            {
                success: false,
                message: "Error Deleting messages"
            },
            { status: 500 }
        )
    }
    
}

