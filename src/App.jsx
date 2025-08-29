import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePolicyPage from "./pages/CreatePolicyPage";
import PolicyListPage from "./pages/PolicyListPage"; 
import NotFoundPage from "./pages/NotFoundPage";
import SearchPoliciesPage from "./pages/SearchPoliciesPage"; 
import SecurityPolicy from "./pages/SecurityPolicy";
import ManagedPolicyManagement from "./pages/ManagedPolicyManagement";

// Import user management pages
import UserManagement from "./pages/UserManagement";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import UserDetail from "./pages/UserDetail";

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
            
            {/* User Management Routes */}
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/users/edit/:id" element={<EditUser />} />
            <Route path="/users/:id" element={<UserDetail />} />

            <Route path="/managed-policies" element={<ManagedPolicyManagement />} />
            
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