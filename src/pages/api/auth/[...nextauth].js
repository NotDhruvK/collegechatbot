import NextAuth from "next-auth"

import { compare } from 'bcryptjs';
import CredentialProvider from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
export const authOptions = {
    // Configure one or more authentication providers
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            id: 'google',
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],

    pages: {
        // signIn: '/auth/login',   // Uncomment this once you have login page
        error: '/auth/error', // Error code passed in query string as ?error=
    },

    callbacks: {

        async signIn({ }) {
            return true;
        },

        jwt: ({ token, user }) => {
            if (user) {
                token = {
                    ...user
                }
            }
            return token
        },
        session: ({ token, session }) => {
            session.user = {
                ...token
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        jwt: true,
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        signingKey: process.env.JWT_SIGNING_KEY,
        verificationOptions: {
            algorithms: ['HS256']
        }
    },
    debug: true,
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user?.uid) {
                const query = {
                    uid: new RegExp(
                        `^${user.name.replace(/[^a-zA-Z]/g, '').toLowerCase()}`,
                        'i'
                    )
                }
                const docs = await User.find(query)

                // Generate new uid for the given name
                let uid = user.name.replace(/[^a-zA-Z]/g, '').toLowerCase()
                if (docs.length > 0) {
                    uid += docs.length
                }
                user.uid = uid || nanoid(10)
            }
            if (account.provider === 'google') {
                user = {
                    id: user.id,
                    uid: user.uid,
                    name: user.username,
                    email: user.email,
                    image: user.image
                }
            }
            return true
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl)
                ? Promise.resolve(url)
                : Promise.resolve(baseUrl)
        },
        async session({ session, token }) {
            session.user.uid = token.uid
            session.user.image = token.picture
            return session
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.id = user.uid
                token.uid = user.uid
            }
            if (account) {
                token.accessToken = account.access_token
                if (account.provider === 'google') token.id = profile.id
            }
            return token
        }
    },
    pages: {
        signIn: '/login',
        signOut: '/',
        newUser: '/'
    }
}

export default NextAuth(authOptions)
