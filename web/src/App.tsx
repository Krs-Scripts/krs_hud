import React, { useState } from "react";
import AppComp from "./components/Status";
import Speedometer from "./components/Speedometer";
import InfoPlayer from "./components/InfoPlayer";
import { useNuiEvent } from "./hooks/useNuiEvent";

const App: React.FC = () => {
  const [globalVisible, setGlobalVisible] = useState(true);

  const [showStatus, setShowStatus] = useState(true);
  const [showInfoPlayer, setShowInfoPlayer] = useState(true);

  useNuiEvent("setVisible", (data: boolean | string) => {
    if (data === "toggle") {
      setGlobalVisible(prev => !prev);
    } else {
      setGlobalVisible(!!data);
    }
  });

  useNuiEvent<boolean>("setShowStatus", setShowStatus);
  useNuiEvent<boolean>("setShowInfoPlayer", setShowInfoPlayer);

  if (!globalVisible) return null;

  return (
    <>
      {showStatus && <AppComp />}

      <Speedometer />

      {showInfoPlayer && <InfoPlayer />}
    </>
  );
};

export default App;