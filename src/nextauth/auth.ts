
import dbConnect from "@/database/connect"
import UserModel from "@/database/models/user.model"
import { comparePassword } from "@/lib/bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import google from "next-auth/providers/google"



export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({

    providers: [
    google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        profile: (profile) => {
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                firstName: profile.given_name,
                lastName: profile.family_name,
                wishList: [],
                joined: new Date(),
                isVerifyed: true,
                signUpMethod: 'GOOGLE',
                role: "USER",
            }
        }
    }),
    /*Credentials(
        {
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "password", required: true }
            },
            async authorize(credentials) {

                await dbConnect();
                const user = await UserModel.findOne({ email: credentials.username });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                if (user.signUpMethod !== 'CREDENTIALS') {
                    throw new Error('Try using ' + user.signUpMethod +' for login.');
                }

                const isValid = await comparePassword(credentials.password, user.password)

                if (!isValid) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    wishList: [],
                    joined: new Date(),
                    isVerifyed: true,
                    signUpMethod: 'CREDENTIALS',
                    role: "USER",
                }
            }
        }
    )*/
    ],

    callbacks: {
        async signIn({ user }) {

            await dbConnect();

            const dbUser = await UserModel.findOne({ email: user.email })

            if (user?.email === (process.env.ADMIN_EMAIL)) {
                user.role = "ADMIN"
            }
            else user.role = "USER"

            if (!dbUser) {
                const newUser = new UserModel({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    password: "",
                    firstName: user.firstName,
                    lastName: user.lastName,
                    bookmark: user.wishList,
                    joined: user.joined,
                    isVerifyed: true,
                    signUpMethod: user.signUpMethod,
                    role: user.role,
                });
                await newUser.save();
            }
            else {
                user.role = dbUser.role
            }

            return true;
        },

        async session({ token, session }) {

            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.picture as string
                session.user.role = token.role
            }
            return session
        },

        async jwt({ token, user }) {

            if (user) {
                token.id = user.id as string;
                token.name = user.name as string;
                token.email = user.email as string;
                token.picture = user.image as string;
                token.role = user.role;
            }
            return token;
        },
    },
    
    pages: {
        error: '/auth/error', // Error code passed in query string as ?error=
    },
})