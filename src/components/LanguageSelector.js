function LanguageSelector() {
  return (
    <div className="flex items-center gap-2 text-[11px] text-woliba-navy">
      <span>Language</span>
      <span className="grid h-3 w-4 overflow-hidden rounded-[1px] border border-gray-200">
        <span className="bg-[#b22234]" />
        <span className="bg-white" />
        <span className="bg-[#3c3b6e]" />
      </span>
      <span>En</span>
      <span className="text-woliba-coral">v</span>
    </div>
  );
}

export default LanguageSelector;
