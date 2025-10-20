import ModelPage from "./pages/model";
import HomePage from "./pages/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-slate-200 via-slate-200 to-amber-100">
        <Sidebar />
        <main className="flex items-center justify-center min-h-screen min-w-screen">
          <div className="w-full max-w-5xl px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/model" element={<ModelPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
