"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/provider/CurrentUserProvider";
import { toast } from "react-hot-toast";

interface LayoutProps {
  children?: React.ReactNode;
  requiredRoles?: string[];
}

const withAuth = (WrappedLayout: React.ComponentType<LayoutProps>, requiredRoles?: string[]) => {
  const WithAuthWrapper: React.FC<LayoutProps> = ({ children, ...props }) => {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(true);
    const { currentUser, isSuccess } = useAuthState();

    useEffect(() => {
      // Check if user is authenticated
      if (!currentUser || !isSuccess) {
        toast.error("Please login to access this page");
        router.push("/login");
        return;
      }

      const userRoles = currentUser.roles || [];

      // If specific roles are required, check if user has any of them
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
        
        if (!hasRequiredRole) {
          toast.error("You don't have permission to access this page");
          
          // Redirect based on user's highest role
          if (userRoles.includes("Admin")) {
            router.push("/AdminMenu");
          } else if (userRoles.includes("ProjectManager")) {
            router.push("/AdminMenu");
          } else if (userRoles.includes("TeamMember")) {
            router.push("/UserMenu");
          } else {
            router.push("/login");
          }
          return;
        }
      }

      setIsRedirecting(false);
    }, [currentUser, isSuccess, router]);

    if (isRedirecting) return null;

    return <WrappedLayout {...props}>{children}</WrappedLayout>;
  };

  return WithAuthWrapper;
};

export default withAuth;
