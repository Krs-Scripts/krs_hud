import { Box, Group, Stack } from "@mantine/core";
import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { IoHeart } from "react-icons/io5";
import { FaShield, FaBurger, FaBomb, FaPersonRunning, FaLungs } from "react-icons/fa6";
import { BiSolidDrink } from "react-icons/bi";
import { useNuiEvent } from "../hooks/useNuiEvent";

export default function HudComp() {
  const [visible, setVisible] = useState(true);
  
  const [status, setStatus] = useState({
    health: 100,
    armor: 0,
    hunger: 76,
    thirst: 76,
    stress: 0,
    stamina: 100,
    oxygen: 0,
    isUnderwater: false,
    civId: "630",
    inVehicle: false,
    isJumping: false
  });

  useNuiEvent<boolean>("setShowStatus", (data) => setVisible(data));

  useNuiEvent("updateStatus", (data: any) => {
    if (!data) return;
    setStatus(prev => ({ ...prev, ...data }));
  });

  const boxSpringAnim = { type: "spring" as const, stiffness: 300, damping: 18, mass: 1 };
  const iconShadowStyle = { filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.8))" };
  const barShadowStyle = "0px 2px 5px rgba(0, 0, 0, 0.6)";
  const jumpTransition = { type: "spring" as const, stiffness: 400, damping: 15, mass: 1 };

  if (!visible) return null;

  return (
    <>
      <motion.div
        animate={{ y: status.isJumping ? -25 : 0 }}
        transition={jumpTransition}
        style={{
          position: "absolute", left: 20, bottom: status.inVehicle ? 275 : 75, 
          zIndex: 11, pointerEvents: "none"
        }}
      >
        <Box
          p={20} w={320}
          style={{
            transform: status.inVehicle ? "none" : "skewY(-3deg) rotate(-2deg)",
            transformOrigin: "bottom left",
            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <Stack gap="xs">
            <Group gap="sm" wrap="nowrap" align="center">
              <IoHeart color="white" size={20} style={iconShadowStyle} />
              <span style={{ color: 'white', fontWeight: 900, fontSize: '18px', textShadow: '0px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'sans-serif' }}>
                {Math.round(status.health)}
              </span>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={boxSpringAnim}
                style={{ flexGrow: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", height: 8, borderRadius: 10, overflow: "hidden", transformOrigin: "left", boxShadow: barShadowStyle }}
              >
                <div style={{ width: `${status.health}%`, height: "100%", backgroundColor: "#ffffff", borderRadius: 10, transition: "width 0.4s ease-out" }} />
              </motion.div>
            </Group>

            <AnimatePresence>
              {status.armor > 0 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Group gap="sm" wrap="nowrap" align="center">
                    <FaShield color="white" size={18} style={iconShadowStyle} />
                    <span style={{ color: 'white', fontWeight: 900, fontSize: '18px', textShadow: '0px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'sans-serif' }}>
                      {Math.round(status.armor)}
                    </span>
                    <motion.div style={{ flexGrow: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", height: 8, borderRadius: 10, overflow: "hidden", transformOrigin: "left", boxShadow: barShadowStyle }}>
                      <div style={{ width: `${status.armor}%`, height: "100%", backgroundColor: "#228be6", borderRadius: 10, transition: "width 0.4s ease-out" }} />
                    </motion.div>
                  </Group>
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </Box>
      </motion.div>

     <motion.div
        animate={{ y: status.isJumping ? -15 : 0 }} transition={jumpTransition}
        style={{
          position: "absolute", left: 20, bottom: status.inVehicle ? -10 : 10, 
          zIndex: 10, pointerEvents: "none"
        }}
      >
        <Box
          p={20}
          style={{
            transform: status.inVehicle ? "none" : "skewY(-3deg) rotate(-2deg)",
            transformOrigin: "bottom left",
            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <Group gap="md" align="center">
            <StatusRing value={status.hunger} icon={<FaBurger size={18} color="white" />} color="#228be6" />
            <StatusRing value={status.thirst} icon={<BiSolidDrink size={18} color="white" />} color="#228be6" />
            <StatusRing value={status.stress} icon={<FaBomb size={18} color="white" />} color="#228be6" />
            <StatusRing value={status.stamina} icon={<FaPersonRunning size={18} color="white" />} color="#228be6" />
            
            {status.isUnderwater && (
              <StatusRing value={status.oxygen} icon={<FaLungs size={18} color="white" />} color="#228be6" />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}>
              <span style={{ color: '#ccc', fontWeight: 900, fontSize: '15px', textShadow: '0px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'sans-serif', lineHeight: 1, marginBottom: 2 }}>
                Civ
              </span>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '20px', textShadow: '0px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'sans-serif', lineHeight: 1 }}>
                {status.civId}
              </span>
            </div>
          </Group>
        </Box>
      </motion.div>
    </>
  );
}

const StatusRing = memo(({ value, icon, color, label }: { value: number, icon: React.ReactNode, color: string, label?: React.ReactNode }) => {
  const radius = 23; 
  const strokeWidth = 6; 
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const arcLength = circumference * 0.75; 
  const fillLength = (value / 100) * arcLength;

  return (
    <div style={{ position: "relative", width: 54, height: 54, display: "flex", flexDirection: "column", alignItems: "center", filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.6))" }}>
      <svg width="54" height="54" style={{ transform: "rotate(135deg)" }}>
        <circle
          stroke="rgba(0, 0, 0, 0.4)" 
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          r={normalizedRadius}
          cx="27"
          cy="27"
          strokeLinecap="round"
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${Math.max(0.01, fillLength)} ${circumference}`}
          r={normalizedRadius}
          cx="27"
          cy="27"
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.4s ease-out" }}
        />
      </svg>
      
      <div style={{ position: "absolute", top: 17, display: "flex", justifyContent: "center", width: "100%" }}>
        {icon}
      </div>

      <div style={{ position: "absolute", bottom: 1, fontWeight: 900, fontSize: 11.5, color: "white", textShadow: "0px 1px 3px rgba(0,0,0,0.8)", fontFamily: 'sans-serif', lineHeight: 1 }}>
        {label !== undefined ? label : Math.round(value)}
      </div>
    </div>
  );
});