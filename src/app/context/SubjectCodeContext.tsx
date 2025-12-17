import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface CodeContextProps {
  preReqCodes: string[];
  setPreReqCodes: Dispatch<SetStateAction<string[]>>;
  postReqCodes: string[];
  setPostReqCodes: Dispatch<SetStateAction<string[]>>;
}

const SubjectCodeContext = createContext<CodeContextProps | undefined>(undefined);

interface SubjectCodeProviderProps {
  children: ReactNode;
}

export const SubjectCodeProvider: React.FC<SubjectCodeProviderProps> = ({ children }) => {
  const [preReqCodes, setPreReqCodes] = useState<string[]>([]);
  const [postReqCodes, setPostReqCodes] = useState<string[]>([]);

  return (
    <SubjectCodeContext.Provider value={{ preReqCodes, setPreReqCodes, postReqCodes, setPostReqCodes }}>
      {children}
    </SubjectCodeContext.Provider>
  );
};

export const useSubjectCodeContext = () => {
  const context = useContext(SubjectCodeContext);
  if (!context) {
    throw new Error('useSubjectCodeContext must be used within a CodeProvider');
  }
  return context;
};
