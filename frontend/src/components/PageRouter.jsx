import { useContext } from "react";
import { AuthContext, RouteContext } from "../context/AppContext";
import About from "../pages/About";
import Ministries from "../pages/Ministries";
import Events from "../pages/Events";
import Sermons from "../pages/Sermons";
import Give from "../pages/Give";
import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Home from '../pages/Home'
import Contact from '../pages/Contact'
import NoticeSlider from "./NoticeSlider";
import Navbar from "./Navbar";
import AdminPortal from "../pages/AdminPortal";
import HeadPortal from "../pages/HeadPortal";
import TreasurerPortal from "../pages/TreasurerPortal";
import MemberPortal from "../pages/MemberPortal";
import Footer from "./Footer";

const AppRouter = () => {
  const { currentRoute } = useContext(RouteContext);
  const { user } = useContext(AuthContext);

  const renderPage = () => {
    switch (currentRoute) {
      case 'home': return <Home />;
      case 'about': return <About />;
      case 'sermons': return <Sermons />;
      case 'events': return <Events />;
      case 'ministries': return <Ministries />;
      case 'give': return <Give />;
      case 'contact': return <Contact />;
      case 'auth': return <Auth />;
      
      // Portals
      case 'admin': return user?.role === 'admin' ? <AdminPortal /> : <Home />;
      case 'head': return user?.role === 'head' ? <HeadPortal /> : <Home />;
      case 'treasurer': return user?.role === 'treasurer' ? <TreasurerPortal /> : <Home />;
      case 'clerk': return user?.role === 'clerk' ? <ClerkPortal /> : <Home />;
      case 'member': return user?.role === 'member' ? <MemberPortal /> : <Home />;
        
      default: return <Home />;
    }
  };

  const isDashboard = ['admin', 'head', 'treasurer', 'clerk', 'member'].includes(currentRoute);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col">
      {!isDashboard && <NoticeSlider />}
      {!isDashboard && <Navbar />}
      
      <main className="grow flex flex-col">
        {renderPage()}
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
};

export default AppRouter;