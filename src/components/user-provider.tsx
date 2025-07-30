import React, { createContext,useState, useEffect } from "react";
import { useContext } from "react";

interface UserSession {
  id: string;
  email: string;
  name?: string | null;
  firebaseUid: string;
}

type UserContext = {
  user: UserSession | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
 }

export const UserContext = createContext<UserContext>({
  user: null,
  isLoading: true,
  setIsLoading: () => {},
});


export const useUser = () => {
    const context = useContext(UserContext);
    if (UserContext === undefined) {
      throw new Error("useUser must be used within a UserProvider");
    }
    return context;
  };

export default function UserProvider({
  children,
  user: initialUser, // initial user data from server
}: {
  children: React.ReactNode;
  user: UserSession | null;
}) {
  const [user, setUser] = useState<UserSession | null>(initialUser);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    // update when initialUser changes
    setUser(initialUser);
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
}
