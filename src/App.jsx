import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePolicyPage from "./pages/CreatePolicyPage";
import PolicyListPage from "./pages/PolicyListPage"; 
import NotFoundPage from "./pages/NotFoundPage";
import SearchPoliciesPage from "./pages/SearchPoliciesPage"; 
import SecurityPolicy from "./pages/SecurityPolicy";



const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <main style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePolicyPage />} />
            <Route path="/policies" element={<PolicyListPage />} /> 
            <Route path="/search" element={<SearchPoliciesPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/edit/:policyId" element={<CreatePolicyPage />} />
            <Route path="/security-policy" element={<SecurityPolicy />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
