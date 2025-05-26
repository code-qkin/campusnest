import React, { useEffect, useState } from 'react';
import { useAuth } from './authen';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

function AdminGuard({ children }) {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!currentUser) {
        console.log("No current user.");
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("User role:", userData.role);
          setIsAdmin(userData.role === 'admin');
        } else {
          console.warn("User document does not exist.");
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [currentUser]);

  if (loading) {
    return <p>Checking admin access...</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminGuard;
