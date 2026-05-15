import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import BottomNav from '../components/layout/BottomNav';
import CreatePostModal from '../components/posts/CreatePostModal';
import { useAppSelector } from '../store';

const MainLayout: React.FC = () => {
  const { isCreatePostOpen } = useAppSelector((s) => s.ui);

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ic-main">
        <Outlet />
      </main>
      <BottomNav />
      {isCreatePostOpen && <CreatePostModal />}
    </>
  );
};

export default MainLayout;
