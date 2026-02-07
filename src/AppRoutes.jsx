// src/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainTranslator from "./MainTranslator";
import RecordSign from "./RecordSign";

export default function AppRoutes() {
  return (
    <Router>
      <nav style={{ padding: 10, background: "#eee" }}>
        <Link to="/" style={{ marginRight: 10 }}>Translator</Link>
        <Link to="/record">Record Sign</Link>
      </nav>

      <Routes>
        <Route path="/" element={<MainTranslator />} />
        <Route path="/record" element={<RecordSign />} />
      </Routes>
    </Router>
  );
}
