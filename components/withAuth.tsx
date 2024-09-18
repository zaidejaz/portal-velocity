// components/WithAuth.tsx

import { useAuth } from '@/contexts/AuthContex';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const WithAuth = (WrappedComponent: React.ComponentType, allowedRoles: string[]) => {
  return (props: any) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      } else if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }, [user, router]);

    if (!user || !allowedRoles.includes(user.role)) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;