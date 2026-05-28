import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import RegistrationLayout from "../components/RegistrationLayout";
import {
  fetchWellnessInterests,
  saveSelectedInterests,
} from "../redux/registrationSlice";

const INTEREST_IMAGE_BASE_URL = "https://d38xnw03cl4zf4.cloudfront.net";

function InterestSelectionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginCredentials, interestsStep, selectedInterests } = useSelector(
    (state) => state.registration
  );
  const [openGroups, setOpenGroups] = useState({});
  const [selectedIds, setSelectedIds] = useState(selectedInterests || []);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchWellnessInterests());
  }, [dispatch]);

  useEffect(() => {
    if (interestsStep.interests.length > 0) {
      const firstGroup = interestsStep.interests[0].interest_type;
      setOpenGroups((current) =>
        Object.keys(current).length ? current : { [firstGroup]: true }
      );
    }
  }, [interestsStep.interests]);

  const groupedInterests = useMemo(() => {
    return interestsStep.interests.reduce((groups, interest) => {
      const groupName = interest.interest_type || "Other";
      return {
        ...groups,
        [groupName]: [...(groups[groupName] || []), interest],
      };
    }, {});
  }, [interestsStep.interests]);

  if (!loginCredentials) {
    return <Navigate to="/registration/login-credentials" replace />;
  }

  const toggleGroup = (groupName) => {
    setOpenGroups((current) => ({
      ...current,
      [groupName]: !current[groupName],
    }));
  };

  const toggleInterest = (interestId) => {
    setSelectedIds((current) => {
      if (current.includes(interestId)) {
        return current.filter((id) => id !== interestId);
      }

      return [...current, interestId];
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (selectedIds.length === 0) {
      return;
    }

    dispatch(saveSelectedInterests(selectedIds));
    navigate("/registration/wellbeing-pillars");
  };

  return (
    <RegistrationLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[1100px] rounded-lg border border-gray-100 bg-white/95 px-5 py-5 shadow-form sm:px-6"
      >
        <h1 className="mb-5 text-center text-lg font-semibold text-woliba-navy sm:text-xl">
          Select all wellness interests that apply - at least one is required.
        </h1>

        {interestsStep.loading && (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading wellness interests...
          </p>
        )}

        {interestsStep.error && (
          <p className="mb-4 border border-red-100 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {interestsStep.error}
          </p>
        )}

        {!interestsStep.loading && (
          <div className="max-h-[360px] overflow-y-auto border-b border-gray-100 pb-4">
            {Object.entries(groupedInterests).map(([groupName, interests]) => {
              const isOpen = openGroups[groupName];

              return (
                <div key={groupName} className="border-b border-gray-50 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => toggleGroup(groupName)}
                    className="flex h-10 w-full items-center justify-between text-left text-xs font-medium text-gray-500"
                  >
                    <span>{groupName}</span>
                    <span className="text-woliba-coral">{isOpen ? "^" : "v"}</span>
                  </button>

                  {isOpen && (
                    <div className="flex flex-wrap gap-2 pb-3">
                      {interests.map((interest) => {
                        const selected = selectedIds.includes(interest.id);

                        return (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => toggleInterest(interest.id)}
                            className={`flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium transition ${
                              selected
                                ? "border-woliba-coral bg-woliba-coral text-white"
                                : "border-gray-200 bg-white text-gray-500 hover:border-woliba-coral hover:text-woliba-coral"
                            }`}
                          >
                            <img
                              src={`${INTEREST_IMAGE_BASE_URL}/${interest.interest_icon}`}
                              alt=""
                              className="h-4 w-4 object-contain"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                            <span>{interest.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {submitted && selectedIds.length === 0 && (
          <p className="mt-3 text-center text-[11px] text-woliba-coral">
            Select at least one wellness interest.
          </p>
        )}

        {selectedIds.length > 0 && (
          <p className="mt-3 text-center text-xs text-gray-500">
            {selectedIds.length} selected
          </p>
        )}

        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/registration/login-credentials")}
            className="h-9 w-36 border border-woliba-coral bg-white text-xs font-medium text-woliba-coral transition hover:bg-woliba-soft"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={selectedIds.length === 0}
            className="h-9 w-36 bg-woliba-coral text-xs font-medium text-white transition hover:bg-[#cf5e69] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Next
          </button>
        </div>
      </form>
    </RegistrationLayout>
  );
}

export default InterestSelectionPage;
