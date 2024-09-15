import React, { useEffect } from 'react';
import { Checkbox, Paper, Button, Title } from '@mantine/core';
import { fetchNui } from "../utils/fetchNui";

interface SettingsMenuProps {
  settings: {
    showHealth: boolean;
    showArmor: boolean;
    showHunger: boolean;
    showThirst: boolean;
    showOxygen: boolean;
    showRadar: boolean;
    showCinematic: boolean;
    showMicrophone: boolean;
    showStamina: boolean;
  };
  handleSettingsChange: (setting: string) => (value: boolean) => void;
  closeMenu: () => void;
  isVisible: boolean;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  settings,
  handleSettingsChange,
  isVisible,
  closeMenu
}) => {
  const handleCheckboxChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked;
    handleSettingsChange(setting)(checked);

    if (setting === 'showRadar') {
      fetchNui(checked ? "showRadar" : "hideRadar", {});
    }

    if (setting === 'showCinematic') {
      fetchNui(checked ? "activeCinematic" : "disableCinematic", {});
    }
  };


  useEffect(() => {
    if (!isVisible) {
      closeMenu();
    }
  }, [isVisible, closeMenu]);

  if (!isVisible) return null;

  return (
    <Paper
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '30px',
        borderRadius: '10px',
        backgroundColor: '#1f1f1f',
        color: '#fff',
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        width: '400px',
        height: '600px',
        boxSizing: 'border-box',
        zIndex: 1000,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Button
        onClick={closeMenu}
        variant="light"
        color="red"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          padding: 0,
          fontSize: '16px',
          zIndex: 1001,
        }}
      >
        X
      </Button>
      <Title order={4} style={{ marginBottom: '10px', marginTop: '40px', alignSelf: 'flex-start' }}>Status</Title>
      <Checkbox
        label="Show health always"
        checked={settings.showHealth}
        onChange={handleCheckboxChange('showHealth')}
        variant="outline"
        radius="md"
        size="md"
        style={{ marginBottom: '10px', alignSelf: 'flex-start' }}
      />
      <Checkbox
        label="Show armor"
        checked={settings.showArmor}
        onChange={handleCheckboxChange('showArmor')}
        variant="outline"
        radius="md"
        size="md"
        style={{ marginBottom: '10px', alignSelf: 'flex-start' }}
      />
      <Checkbox
        label="Show hunger"
        checked={settings.showHunger}
        onChange={handleCheckboxChange('showHunger')}
        variant="outline"
        radius="md"
        size="md"
        style={{ marginBottom: '10px', alignSelf: 'flex-start' }}
      />
      <Checkbox
        label="Show thirst"
        checked={settings.showThirst}
        onChange={handleCheckboxChange('showThirst')}
        variant="outline"
        radius="md"
        size="md"
        style={{ marginBottom: '10px', alignSelf: 'flex-start' }}
      />
      <Checkbox
        label="Show oxygen"
        checked={settings.showOxygen}
        onChange={handleCheckboxChange('showOxygen')}
        variant="outline"
        radius="md"
        size="md"
        style={{ marginBottom: '10px', alignSelf: 'flex-start' }}
      />
      <Checkbox
        label="Show stamina"
        checked={settings.showStamina}
        onChange={handleCheckboxChange('showStamina')}
        variant="outline"
        radius="md"
        size="md"
        style={{ marginBottom: '10px', alignSelf: 'flex-start' }}
      />
      <Checkbox
        label="Show microphone"
        checked={settings.showMicrophone}
        onChange={handleCheckboxChange('showMicrophone')}
        variant="outline"
        radius="md"
        size="md"
        style={{ marginBottom: '10px', alignSelf: 'flex-start' }}
      />
      <Title order={4} style={{ marginTop: '20px', marginBottom: '10px', alignSelf: 'flex-start' }}>Options</Title>
      <Checkbox
        label="Show radar"
        checked={settings.showRadar}
        onChange={handleCheckboxChange('showRadar')}
        variant="outline"
        radius="md"
        size="md"
        style={{ marginBottom: '10px', alignSelf: 'flex-start' }}
      />
      <Title order={4} style={{ marginTop: '20px', marginBottom: '10px', alignSelf: 'flex-start' }}>Cinematic Mode</Title>
      <Checkbox
        label="Enable cinematic mode"
        checked={settings.showCinematic}
        onChange={handleCheckboxChange('showCinematic')}
        variant="outline"
        radius="md"
        size="md"
        style={{ marginBottom: '10px', alignSelf: 'flex-start' }}
      />
    </Paper>
  );
};

export default SettingsMenu;
