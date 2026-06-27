import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PageRouter from "./components/PageRouter";
import { AuthProvider, RouteProvider, ThemeProvider } from "./context/AppContext";

function App() {
    return (
        <div>
            <ThemeProvider>
                <AuthProvider>
                    <RouteProvider>
                        <div>
                            {/* <NoticeSlider /> */}
                            <Navbar />
                            <main className="">
                                <PageRouter />
                            </main>
                            <Footer />
                        </div>
                    </RouteProvider>
                </AuthProvider>
            </ThemeProvider>
        </div>
    )
}

export default App;