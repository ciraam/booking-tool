import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../prisma/prisma.js";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    // LOGIN USER
    CredentialsProvider({
      id: "user-login",
      name: "User Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findFirst({
            where: { user_email: credentials.email }
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.user_password
          );

          if (!isValid) return null;

          return {
            name: '',
            id: user.user_id,
            email: user.user_email,
            firstname: user.user_firstname,
            lastname: user.user_lastname,
            pseudo: user.user_pseudo,
            phone: user.user_phone,
            image: user.user_image,
            isActived: user.user_isActived,
            created: user.user_created,
            role: 'user'
          };
        } catch (error) {
          console.error("User auth error:", error);
          return null;
        }
      }
    }),

    // LOGIN ADMIN
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await prisma.admin.findFirst({
          where: { admin_email: credentials.email }
        });

        if (!admin) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          admin.admin_password
        );

        if (!isValid) return null;

        return {
          name: '',
          id: admin.admin_id,
          email: admin.admin_email,
          firstname: admin.admin_firstname,
          lastname: admin.admin_lastname,
          pseudo: admin.admin_pseudo,
          image: admin.admin_image,
          created: admin.admin_created,
          role: 'admin'
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
        token.created = user.created;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.created = token.created;
      }
      return session;
    }
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);