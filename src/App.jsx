import { useEffect, useState, useRef } from "react";
import "./App.css";

import TopBar from "./components/Topbar";
import { fullRender } from "./utils/tabs";
import { buildInitialData } from "./data/datamodel";
import { init } from "./components/init";
import { loadFromLocalStorage } from "./storage/persistence";

function App() {
  const STATE_ref = useRef(
    loadFromLocalStorage() ||
      buildInitialData("Maverick Aviation", "SkyForge Ind. Aeronáutica"),
  );
  const [tab, setTab] = useState("setup");
  const tabRef = useRef(tab);
  const FILE_NAME_ref = useRef("(nenhum arquivo carregado)");

  useEffect(() => {
    const cleanup = init(STATE_ref, tabRef, setTab, FILE_NAME_ref);
    return cleanup;
  }, []);
  useEffect(() => {
    fullRender(STATE_ref.current, tab, FILE_NAME_ref.current);
    tabRef.current = tab;
  }, [tab]);

  return (
    <>
      <TopBar />
      
    </>
  );
}

export default App;
