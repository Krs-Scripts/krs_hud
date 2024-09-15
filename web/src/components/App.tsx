import React, { useState, useEffect } from 'react';
import { useNuiEvent } from '../hooks/useNuiEvent';
import Menu from './Menu';
import SettingsMenu from './settingsmenu';
import CinematicOverlay from './cinematic';
import './index.scss';
import { fetchNui } from "../utils/fetchNui";

const initialSettings = {
  showHealth: true,
  showArmor: true,
  showHunger: true,
  showThirst: true,
  showOxygen: true,
  showMinimapInVehicle: true,
  showRadar: false,
  showStamina: true,
  showMicrophone: true,
  showCinematic: false,
};

const App: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(true);
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  useNuiEvent<boolean>('setVisibleMenu', (isVisible) => {
    setMenuVisible(isVisible);
  });

  useNuiEvent<{ action?: string; isVisible?: boolean }>('show_menu', (data) => {
    if (data && data.action === 'show_menu') {
      setSettingsMenuVisible(data.isVisible ?? false);
    }
  });

  const handleSettingsChange = (setting: string) => (value: boolean) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: value,
    }));
    setFeedback(`Setting changed: ${setting}`);
    setTimeout(() => setFeedback(null), 2000);

    if (setting === 'showCinematic') {
      console.log(`Cinematic Mode: ${value ? 'Activating' : 'Deactivating'}`);
      if (value) {
        fetchNui("activeCinematic", {});
      } else {
        fetchNui("disableCinematic", {});
      }
    }
  };

  const closeSettingsMenu = () => {
    setSettingsMenuVisible(false);
    fetchNui("hide_menu", {}); 
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data || {};
      switch (data.action) {
        case 'show_menu':
          setSettingsMenuVisible(data.isVisible ?? false);
          break;
        case 'hide_menu':
          setSettingsMenuVisible(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <Menu isVisible={menuVisible} settings={settings} />
      <SettingsMenu
        isVisible={settingsMenuVisible}
        settings={settings}
        handleSettingsChange={handleSettingsChange}
        closeMenu={closeSettingsMenu}
      />
      <CinematicOverlay isActive={settings.showCinematic} />
      {feedback && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          {feedback}
        </div>
      )}
    </>
  );
};

export default App;
