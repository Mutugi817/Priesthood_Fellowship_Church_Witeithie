import { useContext } from "react";
import { RouteContext } from "../context/AppContext";
import About from "../pages/About";
import Ministries from "../pages/Ministries";
import Events from "../pages/Events";
import Sermons from "../pages/Sermons";
import Give from "../pages/Give";
import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Home from '../pages/Home'
import Contact from '../pages/Contact'

function PageRouter() {
    const {currentRoute} = useContext(RouteContext);
    switch (currentRoute) {
        case 'about':
            return <About />;
        case 'ministries':
            return <Ministries />
        case 'sermons':
            return <Sermons />
        case 'events':
            return <Events />
        case 'give':
            return <Give />;
        case 'contact':
            return <Contact />
        case 'auth':
            return <Auth />
        case 'dashboard':
        case 'member':
        case 'admin':
        case 'apostle':
        case 'pastor':
        case 'evangelist':
            return <Dashboard />
        default: return <Home />
    }
}

export default PageRouter;