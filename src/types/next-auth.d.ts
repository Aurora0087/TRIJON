import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT, JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface User extends DefaultUser {
        role: "USER" | "ADMIN";
        wishList: string[];
        email: string;
        joined: Date;
        firstName: string | null;
        lastName: string | null;
        signUpMethod: 'GOOGLE' | 'CREDENTIALS';
    }
    interface Session extends DefaultSession {
        user: User;
    }

}
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT{
        id: string;
        name: string;
        email: string ;
        picture: string;
        role: "USER"|"ADMIN";
    }
}