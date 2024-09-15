import React, { useState, useEffect } from "react";
import { Center, ActionIcon, RingProgress } from '@mantine/core';
import { FaBottleWater, FaShield } from "react-icons/fa6";
import { FaMicrophoneAlt, FaRunning, FaDrumstickBite } from "react-icons/fa";
import { FaLungs } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";

interface HudProp {
  isVisible: boolean;
  settings: {
    showHealth: boolean;
    showArmor: boolean;
    showHunger: boolean;
    showThirst: boolean;
    showOxygen: boolean;
    showStamina: boolean;
    showMicrophone: boolean;
  };
}

const Menu: React.FC<HudProp> = ({ isVisible, settings }) => {
  const [hudData, setHudData] = useState({
    health: 100,
    armor: 0,
    thirst: 100,
    hunger: 100,
    stress: 0,
    stamina: 100,
    oxygen: 100,
    active: false,
    swimming: 100,
    isTalking: false,
    microphone: 100
  });

  const [speed, setVehicleSpeed] = useState(0);
  const [showSpeed, setShowSpeed] = useState(false);
  const [isMetric, setIsMetric] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'update_hud') {
        setHudData(event.data);
      } else if (event.data.action === 'show') {
        setVehicleSpeed(event.data.speed || 0);
        setIsMetric(event.data.isMetric !== undefined ? event.data.isMetric : true);
        setShowSpeed(true);
      } else if (event.data.action === 'hide') {
        setShowSpeed(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const displaySpeed = isMetric ? speed * 3.6 : speed * 2.236936;
  const speedUnit = isMetric ? "kmh" : "mph";
  const micValue = (value: number) => {
    switch (value) {
      case 0:
        return 15;
      case 1:
        return 33;
      case 2:
        return 66;
      case 3:
        return 100;
      default:
        return 33;
    }
  };

  if (!isVisible) return null;

  return (
    <div>
      <div className="menu" style={{ display: 'flex', gap: '1px' }}>
        {settings.showMicrophone && (
          <RingProgress
            size={60}
            thickness={4}
            sections={[{
              value: micValue(hudData.microphone), color: hudData.isTalking ? '#ffd43b' : '#ffffff'
            }]}
            label={
              <Center>
                <ActionIcon
                  variant="default"
                  color={hudData.isTalking ? '#ffd43b' : '#ffffff'}
                  size="xl"
                  radius="xl"
                >
                  <FaMicrophoneAlt style={{ width: 22, height: 22 }} />
                </ActionIcon>
              </Center>
            }
          />
        )}

        {settings.showHealth && hudData.health > 0 && (
          <RingProgress
            size={60}
            thickness={4}
            sections={[{ value: hudData.health, color: '#087f5b' }]}
            label={
              <Center>
                <ActionIcon variant="default" color="#1f1f1f" size="xl" radius="xl">
                  <GoHeartFill style={{ width: 23, height: 23 }} />
                </ActionIcon>
              </Center>
            }
          />
        )}

        {settings.showArmor && hudData.armor > 0 && (
          <RingProgress
            size={60}
            thickness={4}
            sections={[{ value: hudData.armor, color: '#3b5bdb' }]}
            label={
              <Center>
                <ActionIcon variant="default" color="#1f1f1f" size="xl" radius="xl">
                  <FaShield style={{ width: 22, height: 22 }} />
                </ActionIcon>
              </Center>
            }
          />
        )}

        {settings.showHunger && hudData.hunger > 0 && (
          <RingProgress
            size={60}
            thickness={4}
            sections={[{ value: hudData.hunger, color: '#9c36b5' }]}
            label={
              <Center>
                <ActionIcon variant="default" color="#1f1f1f" size="xl" radius="xl">
                  <FaDrumstickBite style={{ width: 22, height: 22 }} />
                </ActionIcon>
              </Center>
            }
          />
        )}

        {settings.showThirst && hudData.thirst > 0 && (
          <RingProgress
            size={60}
            thickness={4}
            sections={[{ value: hudData.thirst, color: '#1864ab' }]}
            label={
              <Center>
                <ActionIcon variant="default" color="#1f1f1f" size="xl" radius="xl">
                  <FaBottleWater style={{ width: 22, height: 22 }} />
                </ActionIcon>
              </Center>
            }
          />
        )}

        {settings.showStamina && hudData.stamina > 0 && (
          <RingProgress
            size={60}
            thickness={4}
            sections={[{ value: hudData.stamina, color: '#d6336c' }]}
            label={
              <Center>
                <ActionIcon variant="default" color="#1f1f1f" size="xl" radius="xl">
                  <FaRunning style={{ width: 22, height: 22 }} />
                </ActionIcon>
              </Center>
            }
          />
        )}

        {settings.showOxygen && hudData.oxygen > 0 && (
          <RingProgress
            size={60}
            thickness={4}
            sections={[{ value: hudData.oxygen, color: '#e8590c' }]}
            label={
              <Center>
                <ActionIcon variant="default" color="#1f1f1f" size="xl" radius="xl">
                  <FaLungs style={{ width: 22, height: 22 }} />
                </ActionIcon>
              </Center>
            }
          />
        )}
      </div>

      {showSpeed && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#141414',
            border: 'none',
            padding: '10px',
            fontFamily: 'monospace',
            borderRadius: '8px',
            color: '#fff'
          }}
        >
          <div style={{ fontSize: '25px', color: '#C9C9C9' }}>
            {displaySpeed.toFixed(0)} {speedUnit}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
