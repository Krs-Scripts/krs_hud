import { Box, rem } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useNuiEvent } from "../hooks/useNuiEvent"; 
import { FaGasPump } from "react-icons/fa";
import { TbEngine } from "react-icons/tb";
import { PiSeatbeltFill } from "react-icons/pi";

const MAX_SPEED = 240; 
const START_ANGLE = -120;
const END_ANGLE = 120;
const BASE_COLOR = "#228be6"; 
const RED_COLOR = "#fe2436"; 

const Speedometer = () => {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false); 

  const [data, setData] = useState({
    speed: 0, 
    fuel: 100,  
    gear: 0,   
    engineHealth: 1000,
    engineOn: false,
    seatbeltOn: false,
    unit: "KM/H",
  });

  const animatedSpeedRef = useRef(0);
  const targetSpeedRef = useRef(0);
  const speedPathRef = useRef<SVGPathElement>(null);
  const speedTextRef = useRef<SVGTextElement>(null);
  const raf = useRef<number | null>(null);

  useNuiEvent<boolean>("setShowSpeedometer", (show) => {
    visibleRef.current = show;
    setVisible(show);
  });

  useNuiEvent("updateSpeedometer", (newData: any) => {
    if (newData.speed !== undefined) {
      targetSpeedRef.current = newData.speed;
    }

    setData(prev => {
      if (
        newData.speed === prev.speed &&
        newData.fuel === prev.fuel &&
        newData.gear === prev.gear &&
        newData.engineHealth === prev.engineHealth &&
        newData.engineOn === prev.engineOn &&
        newData.seatbeltOn === prev.seatbeltOn
      ) return prev;

      return {
        ...prev,
        speed: newData.speed ?? prev.speed,
        fuel: newData.fuel ?? prev.fuel,
        gear: newData.gear ?? prev.gear,
        engineOn: !!newData.engineOn,
        seatbeltOn: !!newData.seatbeltOn,
        engineHealth: newData.engineHealth ?? prev.engineHealth,
        unit: newData.unit ?? prev.unit,
      };
    });
  });


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === "playSound") {
        const file = event.data.file || event.data.data;
        if (!file) return;

        const audio = new Audio(`nui://krs_hud/web/sound/${file}`);
        audio.volume = 0.6;
        audio.play().catch(() => {});
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);


  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => { 
      const deltaTime = time - lastTime;
      lastTime = time;

      const current = animatedSpeedRef.current;
      const target = targetSpeedRef.current;

      const delta = target - current;
      const step = delta * (deltaTime * 0.015); 
      
      let newSpeed = current;
      if (Math.abs(delta) > 0.5) {
        newSpeed = current + step;
      } else {
        newSpeed = target;
      }

      animatedSpeedRef.current = newSpeed;

      if (speedPathRef.current && speedTextRef.current) {
        const safeSpeed = Math.max(newSpeed, 0.1); 
        const needleAngle = START_ANGLE + (safeSpeed / MAX_SPEED) * (END_ANGLE - START_ANGLE);
        
        speedPathRef.current.setAttribute('d', describeArc(100, 100, 85, START_ANGLE, needleAngle));

        const isRedline = safeSpeed > (MAX_SPEED * 0.85);
        const color = isRedline ? RED_COLOR : BASE_COLOR;
        
        speedPathRef.current.setAttribute('stroke', color);
        speedPathRef.current.style.filter = `drop-shadow(0px 0px 6px ${color})`;

        speedTextRef.current.textContent = Math.round(newSpeed).toString();
      }
      
      raf.current = requestAnimationFrame(animate);
    };
    
    raf.current = requestAnimationFrame(animate);
    
    return () => { 
      if (raf.current) cancelAnimationFrame(raf.current); 
    };
  }, []);

 
  if (!visible && !visibleRef.current) {
    return <div style={{ display: "none" }} />;
  }

  return (
    <Box
      style={{
        position: 'absolute',
        bottom: rem(30), 
        right: rem(60),
        width: rem(280),
        height: rem(280),
        zIndex: 10,
        pointerEvents: 'none',
        transform: "perspective(1100px) rotateX(8deg) rotateY(-14deg) rotateZ(2deg)",
        transformOrigin: "bottom right",
      }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" overflow="visible">
        <style>
          {`
            @keyframes blink-icon {
              0% { opacity: 1; }
              50% { opacity: 0.1; }
              100% { opacity: 1; }
            }
            .icon-blink {
              animation: blink-icon 0.8s infinite;
            }
          `}
        </style>
        
        <path
          d={describeArc(100, 100, 85, START_ANGLE, END_ANGLE)}
          stroke="rgba(0, 0, 0, 0.19)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          className="transition-colors duration-[100ms] ease-linear"
        />

        <path
          ref={speedPathRef}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          className="transition-colors duration-[100ms] ease-linear"
        />

        {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => {
          const angle = START_ANGLE + (num * (END_ANGLE - START_ANGLE)) / 7;
          const inner = polarToCartesian(100, 100, 80, angle);
          const outer = polarToCartesian(100, 100, 95, angle);
          return (
            <g key={num}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.7)" strokeWidth="5" strokeLinecap="round" />
              <text 
                x={polarToCartesian(100, 100, 62, angle).x} 
                y={polarToCartesian(100, 100, 62, angle).y} 
                textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill="rgba(255,255,255,0.7)" 
                style={{ fontFamily: 'system-ui, sans-serif', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)' }}
              >
                {num}
              </text>
            </g>
          );
        })}

        <circle cx="100" cy="62" r="13" fill="rgba(0, 0, 0, 0.19)" stroke="rgba(255, 255, 255, 0)" strokeWidth="1" />
        <text x="100" y="63" textAnchor="middle" dominantBaseline="middle" fontSize="15" fill="white" fontWeight="600" style={{ fontFamily: 'system-ui, sans-serif' }}>
          {data.gear === 0 ? 'R' : data.gear}
        </text>

        <text 
          ref={speedTextRef}
          x="100" y="118" textAnchor="middle" fontSize="46" fill="white" fontWeight="1000" 
          style={{ fontFamily: '"Arial Rounded MT Bold", "system-ui", sans-serif', textShadow: '0px 3px 6px rgba(0, 0, 0, 0.03)' }}
        >
          0
        </text>
        
        <text x="100" y="145" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.7)" fontWeight="900" style={{ fontFamily: 'system-ui, sans-serif', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)' }}>
          {data.unit}
        </text>

        <g transform="translate(47, 178)">
          {['FUEL', 'ENG', 'BELT'].map((label, i) => {
            const xPos = i * 45; 
            let val = 25;
            let iconBlink = false;
            let icon = null;
            let barFillColor = "#ffffff";
            let iconColor = "#ffffff";

            if (label === 'FUEL') { 
              val = (data.fuel / 100) * 25; 
              if (data.fuel < 20) {
                barFillColor = "#fe2436";
                iconBlink = true;
              } else {
                barFillColor = "#ffffff";
                iconBlink = false;
              }
              iconColor = barFillColor;
              icon = <FaGasPump size={11} color={iconColor} className={iconBlink ? "icon-blink" : ""} />;
            }
            if (label === 'ENG') { 
              val = (data.engineHealth / 1000) * 25; 
              if (data.engineHealth <= 400) {
                barFillColor = "#fe2436"; 
                iconBlink = true;
              } else if (data.engineHealth <= 700) {
                barFillColor = "#ff8c00"; 
                iconBlink = false;
              } else {
                barFillColor = "#ffffff";
                iconBlink = false;
              }
              iconColor = barFillColor;
              icon = <TbEngine size={13} color={iconColor} className={iconBlink ? "icon-blink" : ""} />;
            }
            if (label === 'BELT') { 
              val = 25; 
              barFillColor = "rgba(255, 255, 255, 0.2)"; 
              iconColor = data.seatbeltOn ? "#ffffff" : "#D5F612"; 
              iconBlink = !data.seatbeltOn; 
              icon = <PiSeatbeltFill size={14} color={iconColor} className={iconBlink ? "icon-blink" : ""} />;
            }

            return (
              <g key={label} transform={`translate(${xPos}, 0)`}>
                <foreignObject x="0" y="-18" width="25" height="15">
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    {icon}
                  </div>
                </foreignObject>
                <rect width="25" height="4" rx="2" fill="rgba(0,0,0,0.5)" />
                <rect 
                  width={val} height="4" rx="2" fill={barFillColor} 
                  style={{ transition: 'width 0.3s ease-out, fill 0.3s ease-out' }}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </Box>
  );
};

export default Speedometer;

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y].join(' ');
}