import React from 'react';
import { AdminUser } from '../types';
import BranchPackageManager from '../components/admin/BranchPackageManager';

interface BranchPackagesProps {
  user?: AdminUser;
  branchId?: string;
}

const BranchPackages: React.FC<BranchPackagesProps> = ({ user, branchId: propBranchId }) => {
  const branchId = propBranchId || user?.branchId;

  if (!branchId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-black text-brand-dark mb-2">Şube Bulunamadı</h2>
          <p className="text-slate-500">Size atanmış bir şube bulunamadı.</p>
        </div>
      </div>
    );
  }

  return <BranchPackageManager branchId={branchId} />;
};

export default BranchPackages;
