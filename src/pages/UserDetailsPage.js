import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import RegistrationLayout from "../components/RegistrationLayout";
import {
  clearUserDetailsStatus,
  saveUserDetails,
} from "../redux/registrationSlice";
import {
  isValidEmail,
  isValidPersonName,
  sanitizeEmail,
  sanitizePersonName,
} from "../utils/validation";

function UserDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { company, userStep } = useSelector((state) => state.registration);
  const { loading, error, success, message } = userStep;
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [touched, setTouched] = useState({});

  const companyName = company?.company_name || "";
  const companyId = company?.id;
  const validEmail = isValidEmail(email);
  const validFirstName = isValidPersonName(firstName);
  const validLastName = isValidPersonName(lastName);
  const canSubmit =
    companyId && validEmail && validFirstName && validLastName && !loading;

  useEffect(() => {
    dispatch(clearUserDetailsStatus());
  }, [email, firstName, lastName, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/registration/otp");
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  if (!companyId) {
    return <Navigate to="/registration" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ email: true, firstName: true, lastName: true });

    if (!canSubmit) {
      return;
    }

    dispatch(
      saveUserDetails({
        companyId,
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
    );
  };

  const handleNameChange = (setter) => (event) => {
    setter(sanitizePersonName(event.target.value));
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

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
              Email ID
            </span>
            <input
              type="email"
              value={email}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              onChange={(event) => setEmail(sanitizeEmail(event.target.value))}
              className={`h-10 w-full border bg-white px-3 text-sm text-woliba-navy outline-none transition focus:border-woliba-coral ${
                touched.email && !validEmail ? "border-woliba-coral" : "border-gray-300"
              }`}
              placeholder="Enter email id"
            />
            {touched.email && !validEmail && (
              <span className="mt-1 block text-[11px] text-woliba-coral">
                Enter a valid email address, for example name@example.com.
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
              First name
            </span>
            <input
              type="text"
              value={firstName}
              onBlur={() => setTouched((prev) => ({ ...prev, firstName: true }))}
              onChange={handleNameChange(setFirstName)}
              className={`h-10 w-full border bg-white px-3 text-sm text-woliba-navy outline-none transition focus:border-woliba-coral ${
                touched.firstName && !validFirstName
                  ? "border-woliba-coral"
                  : "border-gray-300"
              }`}
              placeholder="Enter First name"
            />
            {touched.firstName && !validFirstName && (
              <span className="mt-1 block text-[11px] text-woliba-coral">
                First name is required and can contain letters only.
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
              Last name
            </span>
            <input
              type="text"
              value={lastName}
              onBlur={() => setTouched((prev) => ({ ...prev, lastName: true }))}
              onChange={handleNameChange(setLastName)}
              className={`h-10 w-full border bg-white px-3 text-sm text-woliba-navy outline-none transition focus:border-woliba-coral ${
                touched.lastName && !validLastName
                  ? "border-woliba-coral"
                  : "border-gray-300"
              }`}
              placeholder="Enter Last name"
            />
            {touched.lastName && !validLastName && (
              <span className="mt-1 block text-[11px] text-woliba-coral">
                Last name is required and can contain letters only.
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-woliba-navy">
              Company name
            </span>
            <input
              type="text"
              value={companyName}
              disabled
              className="h-10 w-full border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 outline-none"
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 border border-red-100 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-4 border border-green-100 bg-green-50 px-3 py-2 text-center text-xs text-green-700">
            {message}
          </p>
        )}

        <div className="mt-7 flex justify-center">
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-10 w-36 bg-woliba-coral text-sm font-medium text-white transition hover:bg-[#cf5e69] disabled:cursor-not-allowed disabled:bg-[#e5a2aa]"
          >
            {loading ? "Sending..." : "Verify email"}
          </button>
        </div>
      </form>
    </RegistrationLayout>
  );
}

export default UserDetailsPage;
