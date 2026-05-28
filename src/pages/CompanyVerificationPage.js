import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RegistrationLayout from "../components/RegistrationLayout";
import {
  clearRegistrationStatus,
  verifyCompany,
} from "../redux/registrationSlice";
import {
  isCompanyPasswordValid,
  validateCompanyPassword,
} from "../utils/validation";

function CompanyVerificationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyStep } = useSelector((state) => state.registration);
  const { loading, error, success } = companyStep;
  const [companyName, setCompanyName] = useState("Woliba");
  const [password, setPassword] = useState("Woliba@123!");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const passwordRules = useMemo(() => validateCompanyPassword(password), [password]);
  const hasCompanyName = companyName.trim().length > 0;
  const canSubmit = hasCompanyName && isCompanyPasswordValid(password) && !loading;
  const showCompanyError = touched.companyName && !hasCompanyName;
  const showPasswordError = touched.password && !isCompanyPasswordValid(password);

  useEffect(() => {
    dispatch(clearRegistrationStatus());
  }, [companyName, password, dispatch]);

  useEffect(() => {
    if (success) {
      navigate("/registration/user-details");
    }
  }, [success, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ companyName: true, password: true });

    if (!hasCompanyName || !isCompanyPasswordValid(password)) {
      return;
    }

    dispatch(verifyCompany({ companyName: companyName.trim(), password }));
  };

  return (
    <RegistrationLayout>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[430px] rounded-lg border border-gray-100 bg-white/95 px-5 py-5 shadow-form sm:px-6"
        >
          <h1 className="mb-5 text-center text-2xl font-semibold text-woliba-navy">
            Registration
          </h1>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
                Company Name
              </span>
              <input
                type="text"
                value={companyName}
                onBlur={() => setTouched((prev) => ({ ...prev, companyName: true }))}
                onChange={(event) => setCompanyName(event.target.value)}
                className={`h-10 w-full border bg-white px-3 text-sm text-woliba-navy outline-none transition focus:border-woliba-coral ${
                  showCompanyError ? "border-woliba-coral" : "border-gray-300"
                }`}
                placeholder="Enter company name"
              />
              {showCompanyError && (
                <span className="mt-1 block text-[11px] text-woliba-coral">
                  Company name is required.
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
                Company Password
              </span>
              <div
                className={`flex h-10 items-center border bg-white transition focus-within:border-woliba-coral ${
                  showPasswordError ? "border-woliba-coral" : "border-gray-300"
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-full min-w-0 flex-1 px-3 text-sm text-woliba-navy outline-none"
                  placeholder="Enter company password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="flex h-full w-10 items-center justify-center text-woliba-coral"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>

              {showPasswordError && (
                <ul className="mt-2 space-y-1 text-[11px] text-gray-500">
                  <li className={passwordRules.hasMinimumLength ? "text-green-600" : ""}>
                    Minimum 8 characters
                  </li>
                  <li className={passwordRules.hasUppercase ? "text-green-600" : ""}>
                    At least 1 uppercase letter
                  </li>
                  <li className={passwordRules.hasNumber ? "text-green-600" : ""}>
                    At least 1 number
                  </li>
                </ul>
              )}
            </label>
          </div>

          {error && (
            <p className="mt-4 border border-red-100 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 border border-green-100 bg-green-50 px-3 py-2 text-center text-xs text-green-700">
              Company verified successfully.
            </p>
          )}

          <div className="mt-7 flex justify-center">
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-10 w-36 bg-woliba-coral text-sm font-medium text-white transition hover:bg-[#cf5e69] disabled:cursor-not-allowed disabled:bg-[#e5a2aa]"
            >
              {loading ? "Verifying..." : "Next"}
            </button>
          </div>
        </form>
    </RegistrationLayout>
  );
}

export default CompanyVerificationPage;
