import i18n from "../../i18n";

function LanguageSwitcher() {
  const changeLanguage = (lng) => {
    localStorage.setItem("app_language", lng);
    i18n.changeLanguage(lng);
  };

  return (
    <div className="lang-switcher">
      <button onClick={() => changeLanguage("en")} className="btn btn-outline">
        EN
      </button>
      <button onClick={() => changeLanguage("pl")} className="btn btn-outline">
        PL
      </button>
    </div>
  );
}

export default LanguageSwitcher;
