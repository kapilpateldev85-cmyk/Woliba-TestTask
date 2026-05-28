import { Navigate, Route, Routes } from "react-router-dom";
import CompanyVerificationPage from "../pages/CompanyVerificationPage";
import RegistrationCompletionPage from "../pages/RegistrationCompletionPage";
import InterestSelectionPage from "../pages/InterestSelectionPage";
import LoginCredentialsPage from "../pages/LoginCredentialsPage";
import OtpVerificationPage from "../pages/OtpVerificationPage";
import UserDetailsPage from "../pages/UserDetailsPage";
import WelcomePage from "../pages/WelcomePage";
import WellbeingPillarsPage from "../pages/WellbeingPillarsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/registration" element={<CompanyVerificationPage />} />
      <Route path="/registration/user-details" element={<UserDetailsPage />} />
      <Route path="/registration/otp" element={<OtpVerificationPage />} />
      <Route
        path="/registration/login-credentials"
        element={<LoginCredentialsPage />}
      />
      <Route path="/registration/interests" element={<InterestSelectionPage />} />
      <Route
        path="/registration/wellbeing-pillars"
        element={<WellbeingPillarsPage />}
      />
      <Route
        path="/registration/completion"
        element={<RegistrationCompletionPage />}
      />
      <Route path="/registration/welcome" element={<WelcomePage />} />
      <Route path="*" element={<Navigate to="/registration" replace />} />
    </Routes>
  );
}

export default AppRoutes;
