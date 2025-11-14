import React from "react";

type LanguageFilterProps = {
  availableLanguages: string[];
  selectedLanguage: string | null;
  onChange: (lang: string | null) => void;
};

export default function LanguageFilter({
  availableLanguages,
  selectedLanguage,
  onChange,
}: LanguageFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="font-medium text-sm">
        Filter by language:
      </label>
      <select
        id="language-select"
        value={selectedLanguage ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : e.target.value)
        }
        className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All</option>
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
