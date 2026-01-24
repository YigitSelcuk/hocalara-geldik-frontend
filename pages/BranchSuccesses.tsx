import React from 'react';
import { AdminUser } from '../types';
import BranchSuccessManager from '../components/admin/BranchSuccessManager';

interface BranchSuccessesProps {
  user?: AdminUser;
}

const BranchSuccesses: React.FC<BranchSuccessesProps> = ({ user }) => {
  const branchId = user?.branchId;

  if (!branchId) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
          <p className="text-slate-600">Şube bilgisi bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <BranchSuccessManager branchId={branchId} />
    </div>
  );
};

export default BranchSuccesses;
