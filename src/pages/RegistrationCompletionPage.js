import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import RegistrationLayout from "../components/RegistrationLayout";
import loaderVideo from "../assests/Loader scrren GIF.mp4";
import {
  clearCompletionStatus,
  registerUser,
} from "../redux/registrationSlice";

const HEALTH_DEFAULTS = {
  smoke: "no",
  exercise_day_per_week: "3-4 days",
  average_sleep_per_night: "7-8 hours",
  average_water_intake: "8+ glasses",
  pain_experience: "rarely",
  prescription_intake: "none",
  physical_exam_frequency: "annually",
};

function RegistrationCompletionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submittedRef = useRef(false);
  const {
    userDetails,
    loginCredentials,
    otpToken,
    selectedInterests,
    selectedWellbeingPillars,
    completionStep,
  } = useSelector((state) => state.registration);

  const canComplete =
    userDetails &&
    loginCredentials &&
    otpToken &&
    selectedInterests.length > 0 &&
    selectedWellbeingPillars.length === 3;

  const registrationPayload = useMemo(() => {
    if (!canComplete) {
      return null;
    }

    return {
      fname: userDetails.firstName,
      lname: userDetails.lastName,
      password: loginCredentials.password,
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      token: otpToken,
      areas_of_interest: selectedInterests,
      wellbeing_pillars: selectedWellbeingPillars,
      accepted_privacy_policy: loginCredentials.acceptedTerms,
      birthday: loginCredentials.birthdate,
      phone_number: loginCredentials.contactNumber,
      user_type: 0,
      gender: "",
      profile_image: "",
      language_id: 1,
      ...HEALTH_DEFAULTS,
    };
  }, [
    canComplete,
    userDetails,
    loginCredentials,
    otpToken,
    selectedInterests,
    selectedWellbeingPillars,
  ]);

  useEffect(() => {
    dispatch(clearCompletionStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!registrationPayload || submittedRef.current) {
      return;
    }

    submittedRef.current = true;
    dispatch(registerUser(registrationPayload));
  }, [dispatch, registrationPayload]);

  useEffect(() => {
    if (completionStep.success) {
      navigate("/registration/welcome", { replace: true });
    }
  }, [completionStep.success, navigate]);

  if (!canComplete) {
    return <Navigate to="/registration/wellbeing-pillars" replace />;
  }

  const retryRegistration = () => {
    submittedRef.current = false;
    dispatch(registerUser(registrationPayload));
  };

  return (
    <RegistrationLayout>
      <div className="flex min-h-[360px] w-full flex-col items-center justify-center text-center">
        {completionStep.loading && (
          <>
            <video
              className="mb-4 h-24 w-24 object-contain"
              src={loaderVideo}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Registration loading animation"
            />
            <p className="max-w-[220px] text-left text-base font-semibold leading-snug text-woliba-navy">
              Getting your wellness journey ready...
            </p>
          </>
        )}

        {completionStep.error && (
          <div className="w-full max-w-[460px] rounded-lg border border-red-100 bg-white/95 px-6 py-6 shadow-form">
            <h1 className="text-xl font-semibold text-woliba-navy">
              Registration failed
            </h1>
            <p className="mt-3 text-sm leading-6 text-red-600">
              {completionStep.error}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/registration/wellbeing-pillars")}
                className="h-10 w-32 border border-woliba-coral bg-white text-sm font-medium text-woliba-coral transition hover:bg-woliba-soft"
              >
                Back
              </button>
              <button
                type="button"
                onClick={retryRegistration}
                className="h-10 w-32 bg-woliba-coral text-sm font-medium text-white transition hover:bg-[#cf5e69]"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </RegistrationLayout>
  );
}

export default RegistrationCompletionPage;
