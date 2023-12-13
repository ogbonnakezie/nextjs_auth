import NextAuth from 'next-auth/next';

import CredentialsProvider from 'next-auth/providers/credentials';
import { ConnectToDatabase } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default NextAuth({
  session: {
    jwt: true,
  },

  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await ConnectToDatabase();

        const usersCollection = client.db().collection('users');

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error('User Not found');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error('Could not log you in');
        }

        return { email: user.email };
        client.close();
      },
    }),

    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
  ],
});
