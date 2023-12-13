import { getServerSession } from 'next-auth/next';
// import { authOptions } from '.[...nextauth]';
import Nextauth from '../auth/[...nextauth]';
import { ConnectToDatabase } from '../../../lib/db';
import { hashPassword, verifyPassword } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  // // const session = await getSession({ req: req });

  const session = await getServerSession(req, res, Nextauth);

  if (!session) {
    res.status(401).json({ message: 'Not Authenticated' });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await ConnectToDatabase();

  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: 'User not Found!' });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordAreEqual) {
    res.status(403).json({ message: 'Invalid Password' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );
  client.close();
  res.status(200).json({ message: 'Password Updated!' });
}

export default handler;
