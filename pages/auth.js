import { getSession } from 'next-auth/react';
import AuthForm from '../components/auth/auth-form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Error from 'next/error';
import Errors from './error';

function AuthPage() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/');
      } else {
        setisLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <p>Loading ... </p>;
  }
  return <AuthForm />;
}

export default AuthPage;
