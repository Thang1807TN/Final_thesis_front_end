import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = i18n.language || "en";

  const changeLanguage = (lng) => {
    localStorage.setItem("app_language", lng);
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        type="button"
        className="language-icon-btn"
        onClick={() => setOpen((prev) => !prev)}
        title="Change language"
      >
        🌐
      </button>

      {open && (
        <div className="language-dropdown">
          <button
            className={`language-item ${
              currentLang.startsWith("en") ? "active" : ""
            }`}
            onClick={() => changeLanguage("en")}
          >
            🇬🇧 English
          </button>

          <button
            className={`language-item ${
              currentLang.startsWith("pl") ? "active" : ""
            }`}
            onClick={() => changeLanguage("pl")}
          >
            🇵🇱 Polski
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
