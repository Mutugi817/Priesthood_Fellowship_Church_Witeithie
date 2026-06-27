import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import NoticeSlider from "./components/NoticeSlider";
import AppRouter from "./components/PageRouter";
import PageRouter from "./components/PageRouter";
import { AuthProvider, RouteProvider, ThemeProvider } from "./context/AppContext";

function App() {
    return (
        <div>
            <ThemeProvider>
                <AuthProvider>
                    <RouteProvider>
                        <AppRouter />
                    </RouteProvider>
                </AuthProvider>
            </ThemeProvider>
        </div>
    )
}

export default App;