import React from "react";
import { ReactNode, createContext, useState, useEffect } from "react";
import Agent from "../api/agent";

type Props = {
  children?: ReactNode;
};

interface AuthContextProps {
  authenticated: boolean;
  setAuthenticated: (newState: boolean) => void;
  username?: string;
  setUsername: (newUsername: string) => void;
}

const initialValue: AuthContextProps = {
  authenticated: false,
  setAuthenticated: () => {},
  username: undefined,
  setUsername: () => {},
};

const AuthContext = createContext<AuthContextProps>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(
    initialValue.authenticated
  );
  const [username, setUsername] = useState<string | undefined>(
    initialValue.username
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username") ?? undefined;
    if (storedToken) {
      setAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ authenticated, setAuthenticated, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
