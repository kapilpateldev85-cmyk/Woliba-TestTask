import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import RegistrationLayout from "../components/RegistrationLayout";
import {
  fetchWellbeingPillars,
  saveSelectedWellbeingPillars,
} from "../redux/registrationSlice";

const REQUIRED_PILLAR_COUNT = 3;

function WellbeingPillarsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedInterests, selectedWellbeingPillars, wellbeingPillarsStep } =
    useSelector((state) => state.registration);
  const [selectedIds, setSelectedIds] = useState(selectedWellbeingPillars || []);
  const [submitted, setSubmitted] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const exactSelection = selectedIds.length === REQUIRED_PILLAR_COUNT;

  useEffect(() => {
    dispatch(fetchWellbeingPillars());
  }, [dispatch]);

  if (!selectedInterests.length) {
    return <Navigate to="/registration/interests" replace />;
  }

  const togglePillar = (pillarId) => {
    setSubmitted(false);

    if (selectedIds.includes(pillarId)) {
      setLimitReached(false);
      setSelectedIds(selectedIds.filter((id) => id !== pillarId));
      return;
    }

    if (selectedIds.length >= REQUIRED_PILLAR_COUNT) {
      setLimitReached(true);
      return;
    }

    setLimitReached(false);
    setSelectedIds([...selectedIds, pillarId]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!exactSelection) {
      return;
    }

    dispatch(saveSelectedWellbeingPillars(selectedIds));
    navigate("/registration/completion");
  };

  const showValidation = submitted && !exactSelection;

  return (
    <RegistrationLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[1080px] rounded-lg border border-gray-100 bg-white/95 px-5 py-5 shadow-form sm:px-6"
      >
        <h1 className="mb-5 text-center text-lg font-semibold text-woliba-navy sm:text-xl">
          Select any 3 well-being pillars goal you want to achieve
        </h1>

        {wellbeingPillarsStep.loading && (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading wellbeing pillars...
          </p>
        )}

        {wellbeingPillarsStep.error && (
          <p className="mb-4 border border-red-100 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {wellbeingPillarsStep.error}
          </p>
        )}

        {!wellbeingPillarsStep.loading && !wellbeingPillarsStep.error && (
          <div className="grid gap-4 border-b border-gray-100 pb-6 sm:grid-cols-2 lg:grid-cols-3">
            {wellbeingPillarsStep.pillars.map((pillar) => {
              const selected = selectedIds.includes(pillar.id);

              return (
                <label
                  key={pillar.id}
                  className={`flex min-h-[58px] cursor-pointer items-start gap-3 border px-3 py-3 transition ${
                    selected
                      ? "border-woliba-coral bg-woliba-soft"
                      : "border-gray-100 bg-white hover:border-woliba-coral"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => togglePillar(pillar.id)}
                    className="mt-1 h-4 w-4 flex-none accent-woliba-coral"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-woliba-navy">
                      {pillar.pillar_title}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-gray-400">
                      {pillar.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {limitReached && (
          <p className="mt-3 text-center text-[11px] text-woliba-coral">
            You can select only 3 wellbeing pillars.
          </p>
        )}

        {showValidation && (
          <p className="mt-3 text-center text-[11px] text-woliba-coral">
            Select exactly 3 wellbeing pillars to continue.
          </p>
        )}

        {exactSelection && (
          <p className="mt-3 text-center text-xs text-gray-500">
            3 pillars selected
          </p>
        )}

        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/registration/interests")}
            className="h-9 w-36 border border-woliba-coral bg-white text-xs font-medium text-woliba-coral transition hover:bg-woliba-soft"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!exactSelection}
            className="h-9 w-36 bg-woliba-coral text-xs font-medium text-white transition hover:bg-[#cf5e69] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Done
          </button>
        </div>
      </form>
    </RegistrationLayout>
  );
}

export default WellbeingPillarsPage;
