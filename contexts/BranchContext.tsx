import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Branch } from '../types';

interface BranchContextType {
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch | null) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);

  return (
    <BranchContext.Provider value={{ currentBranch, setCurrentBranch }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
