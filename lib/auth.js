import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import avatar3 from "@/public/images/avatar/avatar-3.jpg";

export const user = [
  {
    id: 1,
    name: "dashtail",
    image: avatar3,
    password: "password", // NOTE: This is plaintext. Not secure.
    email: "dashtail@codeshaper.net",
    resetToken: null,
    resetTokenExpiry: null,
    profile: null,
  },
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const foundUser = user.find((u) => u.email === credentials.email);

        if (!foundUser) {
          throw new Error("User not found");
        }

        // Check password (plaintext comparison for demo only)
        const correctPassword = credentials.password === foundUser.password;

        if (!correctPassword) {
          throw new Error("Invalid password");
        }

        return foundUser;
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.email?.endsWith(process.env.ALLOWED_DOMAIN || "@codeshaper.net")) {
        // Allow fallback if ALLOWED_DOMAIN not set
        return false;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  debug: process.env.NODE_ENV !== "production",
};
