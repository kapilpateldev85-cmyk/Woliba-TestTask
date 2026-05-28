import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import RegistrationLayout from "../components/RegistrationLayout";

const getDisplayName = (user, userDetails) => {
  const firstName = user?.fname || userDetails?.firstName || "";
  const lastName = user?.lname || userDetails?.lastName || "";
  return `${firstName} ${lastName}`.trim() || "there";
};

function WelcomePage() {
  const {
    userDetails,
    loginCredentials,
    selectedInterests,
    selectedWellbeingPillars,
    completionStep,
  } = useSelector((state) => state.registration);

  const user = completionStep.user;
  const hasSuccessfulRegistration = completionStep.success || user;
  const displayName = useMemo(
    () => getDisplayName(user, userDetails),
    [user, userDetails]
  );

  const userFacts = [
    {
      label: "Email",
      value: user?.mail || userDetails?.email,
    },
    {
      label: "Birthday",
      value: user?.birthday || loginCredentials?.birthdate,
    },
    {
      label: "Phone",
      value: user?.phone_number || loginCredentials?.contactNumber,
    },
    {
      label: "Wellness interests",
      value: selectedInterests.length ? `${selectedInterests.length} selected` : "",
    },
    {
      label: "Wellbeing pillars",
      value: selectedWellbeingPillars.length
        ? `${selectedWellbeingPillars.length} selected`
        : "",
    },
  ].filter((item) => item.value);

  if (!hasSuccessfulRegistration) {
    return <Navigate to="/registration" replace />;
  }

  return (
    <RegistrationLayout>
      <section className="relative flex w-full max-w-[760px] flex-col items-center px-4 py-6 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 flex h-32 w-32 items-center justify-center">
            <svg
              viewBox="0 0 160 160"
              role="img"
              aria-label="Calm wellness illustration"
              className="h-full w-full"
              fill="none"
            >
              <path
                d="M103 36c16 10 23 27 18 48"
                stroke="#F6D7D3"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M108 39c4 12 2 24-6 35"
                stroke="#F6D7D3"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M51 84c-12 1-21 5-22 13-1 9 12 14 30 10"
                stroke="#0F4559"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M109 84c12 1 21 5 22 13 1 9-12 14-30 10"
                stroke="#0F4559"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M58 75c6 13 38 13 44 0"
                stroke="#0F4559"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M62 57c0-11 8-20 18-20s18 9 18 20v13c0 11-8 20-18 20s-18-9-18-20V57Z"
                fill="white"
                stroke="#0F4559"
                strokeWidth="7"
              />
              <path
                d="M65 58h30"
                stroke="#82A1DA"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M70 37c2-10 18-10 20 0"
                stroke="#0F4559"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M55 110h50c13 0 24 8 24 18H31c0-10 11-18 24-18Z"
                fill="white"
                stroke="#0F4559"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M55 110c-8 9-13 15-20 18"
                stroke="#0F4559"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M105 110c8 9 13 15 20 18"
                stroke="#0F4559"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M35 62l6 7 7-7-7-7-6 7Z"
                stroke="#82A1DA"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M122 39l5 6 6-6-6-6-5 6Z"
                stroke="#82A1DA"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M30 82h-11M135 82h11"
                stroke="#DF6874"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-woliba-navy sm:text-3xl">
            Welcome {displayName}!
          </h1>
          <p className="mt-3 max-w-[520px] text-sm leading-6 text-woliba-navy sm:text-base">
            Welcome to Woliba! You&apos;ll find wellness challenges, fitness and
            recipe videos, and daily tips to support your health goals.
          </p>

          {userFacts.length > 0 && (
            <dl className="mt-7 grid w-full max-w-[620px] gap-3 text-left sm:grid-cols-2">
              {userFacts.map((item) => (
                <div
                  key={item.label}
                  className="border border-gray-100 bg-white/90 px-4 py-3"
                >
                  <dt className="text-[11px] font-semibold uppercase text-gray-400">
                    {item.label}
                  </dt>
                  <dd className="mt-1 break-words text-sm font-medium text-woliba-navy">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <button
            type="button"
            className="mt-7 h-10 w-full max-w-[260px] bg-woliba-coral text-sm font-medium text-white transition hover:bg-[#cf5e69]"
          >
            Let&apos;s get Started
          </button>
        </div>
      </section>
    </RegistrationLayout>
  );
}

export default WelcomePage;
