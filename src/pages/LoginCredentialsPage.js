import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import RegistrationLayout from "../components/RegistrationLayout";
import { saveLoginCredentials } from "../redux/registrationSlice";
import {
  isCompanyPasswordValid,
  isValidBirthdate,
  isValidContactNumber,
  sanitizeContactNumber,
  validateCompanyPassword,
} from "../utils/validation";

function LoginCredentialsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { otpStep } = useSelector((state) => state.registration);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const passwordRules = useMemo(() => validateCompanyPassword(password), [password]);
  const validPassword = isCompanyPasswordValid(password);
  const passwordsMatch = password && password === confirmPassword;
  const validBirthdate = isValidBirthdate(birthdate);
  const validContactNumber = isValidContactNumber(contactNumber);
  const canSubmit =
    validPassword &&
    passwordsMatch &&
    validBirthdate &&
    validContactNumber &&
    acceptedTerms;

  if (!otpStep.success) {
    return <Navigate to="/registration/otp" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({
      password: true,
      confirmPassword: true,
      birthdate: true,
      contactNumber: true,
      acceptedTerms: true,
    });

    if (!canSubmit) {
      return;
    }

    dispatch(
      saveLoginCredentials({
        password,
        birthdate,
        contactNumber: contactNumber.trim(),
        acceptedTerms,
      })
    );
    navigate("/registration/interests");
  };

  const renderPasswordToggle = (isVisible, onClick) => (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-10 items-center justify-center text-woliba-coral"
      aria-label={isVisible ? "Hide password" : "Show password"}
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
  );

  return (
    <RegistrationLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[460px] rounded-lg border border-gray-100 bg-white/95 px-5 py-5 shadow-form sm:px-6"
      >
        <h1 className="mb-5 text-center text-2xl font-semibold text-woliba-navy">
          Login Credentials
        </h1>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
              Password
            </span>
            <div
              className={`flex h-10 items-center border bg-white transition focus-within:border-woliba-coral ${
                touched.password && !validPassword
                  ? "border-woliba-coral"
                  : "border-gray-300"
              }`}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                onChange={(event) => setPassword(event.target.value)}
                className="h-full min-w-0 flex-1 px-3 text-sm text-woliba-navy outline-none"
                placeholder="Enter password"
              />
              {renderPasswordToggle(showPassword, () =>
                setShowPassword((current) => !current)
              )}
            </div>
            {touched.password && !validPassword && (
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

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
              Confirm password
            </span>
            <div
              className={`flex h-10 items-center border bg-white transition focus-within:border-woliba-coral ${
                touched.confirmPassword && !passwordsMatch
                  ? "border-woliba-coral"
                  : "border-gray-300"
              }`}
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, confirmPassword: true }))
                }
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="h-full min-w-0 flex-1 px-3 text-sm text-woliba-navy outline-none"
                placeholder="Enter password"
              />
              {renderPasswordToggle(showConfirmPassword, () =>
                setShowConfirmPassword((current) => !current)
              )}
            </div>
            {touched.confirmPassword && !passwordsMatch && (
              <span className="mt-1 block text-[11px] text-woliba-coral">
                Passwords must match.
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
              Birthday
            </span>
            <input
              type="date"
              value={birthdate}
              onBlur={() => setTouched((prev) => ({ ...prev, birthdate: true }))}
              onChange={(event) => setBirthdate(event.target.value)}
              className={`h-10 w-full border bg-white px-3 text-sm text-woliba-navy outline-none transition focus:border-woliba-coral ${
                touched.birthdate && !validBirthdate
                  ? "border-woliba-coral"
                  : "border-gray-300"
              }`}
            />
            {touched.birthdate && !validBirthdate && (
              <span className="mt-1 block text-[11px] text-woliba-coral">
                Select a valid birthdate.
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
              Contact number
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={contactNumber}
              onBlur={() => setTouched((prev) => ({ ...prev, contactNumber: true }))}
              maxLength="15"
              onChange={(event) =>
                setContactNumber(sanitizeContactNumber(event.target.value))
              }
              className={`h-10 w-full border bg-white px-3 text-sm text-woliba-navy outline-none transition focus:border-woliba-coral ${
                touched.contactNumber && !validContactNumber
                  ? "border-woliba-coral"
                  : "border-gray-300"
              }`}
              placeholder="Enter contact number"
            />
            {touched.contactNumber && !validContactNumber && (
              <span className="mt-1 block text-[11px] text-woliba-coral">
                Enter a valid phone number with 10 to 15 digits.
              </span>
            )}
          </label>

          <label className="flex items-start gap-2 border-b border-gray-100 pb-4 text-[11px] text-woliba-navy">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="mt-[2px] h-4 w-4 accent-woliba-coral"
            />
            <span>
              I agree to Woliba&apos;s{" "}
              <a href="/terms" className="text-woliba-coral hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-woliba-coral hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {touched.acceptedTerms && !acceptedTerms && (
            <span className="-mt-2 block text-[11px] text-woliba-coral">
              Please accept the terms and conditions.
            </span>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/registration/otp")}
            className="h-9 w-28 border border-woliba-coral bg-white text-xs font-medium text-woliba-coral transition hover:bg-woliba-soft"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="h-9 w-28 bg-woliba-coral text-xs font-medium text-white transition hover:bg-[#cf5e69] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Next
          </button>
        </div>
      </form>
    </RegistrationLayout>
  );
}

export default LoginCredentialsPage;
