import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import NotFound from './pages/NotFound'
import { useTheme } from "./context/ThemeContext";
import "./styles.css";

function App() {
  const { theme } = useTheme();

  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;