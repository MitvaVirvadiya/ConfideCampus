import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {email, username, password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true})

        if(existingUserVerifiedByUsername){
            return Response.json(
            {
                success: false,
                    message: "Username is already taken"
                }, {status: 400}
            )
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                            message: "Email is already taken"
                    }, {status: 400}
                )
            } else {
                const hashedpassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedpassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        } else {
            const hashedpassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedpassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                }, {status: 500}
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registration successfully, Please verify your email"
            }, {status: 201}
        )
    } catch (error) {
        console.error('Error registering user', error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}