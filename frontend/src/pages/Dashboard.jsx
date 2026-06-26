/** @format */

import React, { useContext } from 'react';
import DashboardWrapper from '../components/DashboardWrapper.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { User } from 'lucide-react';
import { AuthContext } from '../context/AppContext.jsx';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <DashboardWrapper
      roleTitle='Member Portal'
      sidebarItems={[{ id: 'home', name: 'Member Home', icon: User }]}
      currentSubTab={'home'}>
      <div className='space-y-6'>
        <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
          Welcome back,{' '}
          <span className='text-[#800000] capitalize'>{user?.name}</span>
        </h3>
        <EmptyState
          title='Portal Home'
          message='Use the sidebar to navigate your member tools and petitions.'
        />
      </div>
    </DashboardWrapper>
  );
};

export default Dashboard;
