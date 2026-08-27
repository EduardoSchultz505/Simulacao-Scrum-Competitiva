import { fullRender } from "../utils/tabs";
import { applyFontScale, changeFontScale } from "../utils/fonte";
import { handleSave, handleLoadFile, handleReset } from "../storage/save";
import { attachDelegatedEvents } from "../utils/eventDelegated";

export function init(STATE_ref, tabRef, setTab, FILE_NAME_ref) {
  // eslint-disable-next-line no-unused-vars
  const STATE = STATE_ref.current;  

  const onTabClick = (e) => {
    const t = e.target.closest(".tab");
    if (!t) return;
    setTab(t.getAttribute("data-tab"));
  };
  const onSaveClick = () => handleSave(STATE_ref.current);
  const onLoadClick = () => document.getElementById("fileInput").click();
  const onFileChange = (e) => {
    if (e.target.files[0]) handleLoadFile(e.target.files[0], STATE_ref, FILE_NAME_ref, tabRef);
    e.target.value = "";
  };
  const onResetClick = () => handleReset(STATE_ref, FILE_NAME_ref, tabRef);
  const onFontMinus = () => changeFontScale(-1, STATE_ref.current);
  const onFontPlus = () => changeFontScale(1, STATE_ref.current);
  const onFontReset = () => {
    STATE_ref.current.meta.fontScale = 16;
    applyFontScale(STATE_ref.current);
    document.getElementById("fontLbl").textContent = "16px";
  };

  document.getElementById("tabsBar").addEventListener("click", onTabClick);
  document.getElementById("btnSave").addEventListener("click", onSaveClick);
  document.getElementById("btnLoad").addEventListener("click", onLoadClick);
  document.getElementById("fileInput").addEventListener("change", onFileChange);
  document.getElementById("btnReset").addEventListener("click", onResetClick);
  document.getElementById("fontMinus").addEventListener("click", onFontMinus);
  document.getElementById("fontPlus").addEventListener("click", onFontPlus);
  document.getElementById("fontReset").addEventListener("click", onFontReset);

  attachDelegatedEvents(STATE_ref, tabRef);
  applyFontScale(STATE_ref.current);
  fullRender(STATE_ref.current, tabRef.current, FILE_NAME_ref.current);

  return () => {
    document.getElementById("tabsBar")?.removeEventListener("click", onTabClick);
    document.getElementById("btnSave")?.removeEventListener("click", onSaveClick);
    document.getElementById("btnLoad")?.removeEventListener("click", onLoadClick);
    document.getElementById("fileInput")?.removeEventListener("change", onFileChange);
    document.getElementById("btnReset")?.removeEventListener("click", onResetClick);
    document.getElementById("fontMinus")?.removeEventListener("click", onFontMinus);
    document.getElementById("fontPlus")?.removeEventListener("click", onFontPlus);
    document.getElementById("fontReset")?.removeEventListener("click", onFontReset);
  };
}
