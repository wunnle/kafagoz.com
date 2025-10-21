import React, { useRef, useEffect, useState } from 'react';

const EyeSVG = () => {
  const svgRef = useRef(null);
  const trackerRef = useRef(null);
  const irisAreaRef = useRef(null);
  const shineRef = useRef(null);
  const eyelidsGroupRef = useRef(null);
  
  const [numberOfClicks, setNumberOfClicks] = useState(0);
  const [eyeOpen, setEyeOpen] = useState(true);
  const shineVisible = useRef(true);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  

  const MAX_X = 5.5;
  const MAX_Y = 3.6;
  const ease = 0.20;

  useEffect(() => {
    const svg = svgRef.current;
    const tracker = trackerRef.current;
    const irisArea = irisAreaRef.current;
    const shine = shineRef.current;
    const eyelidsGroup = eyelidsGroupRef.current;
    const eyeLashes = svg?.querySelector('.eye-lashes');

    if (!svg || !tracker || !irisArea || !shine || !eyelidsGroup) return;

    const box = irisArea.getBBox();
    const EYE_CX = box.x + box.width / 2;
    const EYE_CY = box.y + box.height / 2;

    const svgPointFromPage = (evt) => {
      const pt = svg.createSVGPoint();
      if (evt.touches && evt.touches[0]) {
        pt.x = evt.touches[0].clientX;
        pt.y = evt.touches[0].clientY;
      } else {
        pt.x = evt.clientX;
        pt.y = evt.clientY;
      }
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };

    const onMove = (evt) => {
      const p = svgPointFromPage(evt);
      let dx = p.x - EYE_CX;
      let dy = p.y - EYE_CY;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      target.current.x = dx * MAX_X;
      target.current.y = dy * MAX_Y;
    };

    const blinkDown = () => {
      setEyeOpen(false);
      
      setTimeout(() => {
        if (eyeLashes) {
          eyeLashes.style.opacity = '0';
        }
      }, 50);

      const upper = svg.querySelector('.eyelidUpper');
      const lower = svg.querySelector('.eyelidLower');
      
      if (upper && lower) {
        if (numberOfClicks > 3) {
          upper.style.transition = 'transform 0.05s ease-in';
          lower.style.transition = 'transform 0.05s ease-in';
        } else {
          upper.style.transition = 'transform 0.22s ease-in';
          lower.style.transition = 'transform 0.22s ease-in';
        }
        upper.style.transform = 'translateY(-20%)';
        lower.style.transform = 'translateY(-20%)';
      }
    };

    const squint = () => {
      setEyeOpen(false);
      
      setTimeout(() => {
        if (eyeLashes) {
          eyeLashes.style.opacity = '0';
        }
      }, 50);

      const upper = svg.querySelector('.eyelidUpper');
      const lower = svg.querySelector('.eyelidLower');
      if (upper && lower) {
        upper.style.transition = 'transform 0.22s ease-in';
        lower.style.transition = 'transform 0.22s ease-in';
        upper.style.transform = 'translateY(-33%)';
        lower.style.transform = 'translateY(-18%)';
      }
    };

    const blinkUp = () => {
      setTimeout(() => {
        const upper = svg.querySelector('.eyelidUpper');
        const lower = svg.querySelector('.eyelidLower');
        if (upper && lower) {
          upper.style.transition = 'transform 0.2s ease-out';
          lower.style.transition = 'transform 0.2s ease-out';
          upper.style.transform = 'translateY(-100%)';
          lower.style.transform = 'translateY(100%)';
          setEyeOpen(true);
        }
      }, 200);

      setTimeout(() => {
        if (eyeLashes) {
          eyeLashes.style.opacity = '1';
        }
      }, 270);
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;
      
      tracker.setAttribute('transform', `translate(${pos.current.x.toFixed(3)}, ${pos.current.y.toFixed(3)})`);
      eyelidsGroup.setAttribute('transform', `translate(${(pos.current.x - 20).toFixed(3)}, ${(pos.current.y - 2).toFixed(3)})`);
      
      if (shineVisible.current) {
        const ibox = irisArea.getBBox();
        const a = ibox.width / 2;
        const b = ibox.height / 2;
        const cx = ibox.x + a;
        const cy = ibox.y + b;

        const baseX = cx - a * 0.35;
        const baseY = cy - b * 0.35;

        let hx = baseX - pos.current.x * 0.15;
        let hy = baseY - pos.current.y * 0.15;

        let rx = hx - cx;
        let ry = hy - cy;
        const k = (rx * rx) / (a * a) + (ry * ry) / (b * b);
        if (k > 1) {
          const s = Math.sqrt(k);
          rx /= s;
          ry /= s;
        }

        shine.setAttribute('cx', (cx + rx).toFixed(2));
        shine.setAttribute('cy', (cy + ry).toFixed(2));
      }
      requestAnimationFrame(tick);
    };

    const handleMouseDown = () => {
      blinkDown();
      setNumberOfClicks(prev => prev + 1);
    };

    const handleMouseUp = () => {
      blinkUp();
    };

    const handleMouseEnter = () => {
      console.log(numberOfClicks);
      if (numberOfClicks > 3) {
        squint();
      }
    };

    const handlePointerLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    const handleMouseLeave = () => {
      blinkUp();
    };

    const doubleBlink = () => {
      blinkDown();
      setTimeout(() => {
        blinkUp();
        setTimeout(() => {
          blinkDown();
          setTimeout(() => {
            blinkUp();
          }, 100);
        }, 200);
      }, 100);
    };

    const automaticBlink = () => {
      if (eyeOpen) {
        blinkDown();
        setTimeout(() => {
          blinkUp();
        }, 100);
      }
      const delay = 6000 + Math.random() * 12000;
      setTimeout(automaticBlink, delay);
    };

    // Event listeners
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('mouseup', handleMouseUp);
    svg.addEventListener('mousedown', handleMouseDown);
    svg.addEventListener('mouseenter', handleMouseEnter);
    svg.addEventListener('mouseleave', handleMouseLeave);

    // Initial state - exactly like original
    blinkUp();
    doubleBlink();
    automaticBlink();
    tick();

    // Cleanup
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('mouseup', handleMouseUp);
      svg.removeEventListener('mousedown', handleMouseDown);
      svg.removeEventListener('mouseenter', handleMouseEnter);
      svg.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [numberOfClicks, eyeOpen]);

  return (
    <svg
      ref={svgRef}
      className="logo"
      id="eyeSVG"
      width="150"
      height="150"
      viewBox="0 0 90 140"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      role="img"
      aria-label="Character with eye that follows the cursor"
    >
      {/* Torso / limbs */}
      <path
        className="white-bg"
        d="M41.8661 132.5H27.8661L29.3661 111L22.3661 109L8.36609 96L11.3661 85.5L22.8661 75.5H63.3661L73.8661 84L75.8661 97.5L60.8661 111L64.3661 132.5L49.8661 132L48.3661 119L44.3661 119.5L41.8661 132.5Z"
        fill="white"
      />
      <path
        className="left-arm-shadow"
        d="M29.8658 103L29.3658 104.5C23.3661 102 24.3657 102.5 18.3658 97.5C16.8659 96.25 15.8658 93.9999 16.3658 91.5C18.8657 88.5 21.866 85.9999 28.3658 83L29.8658 103ZM19.7105 93.4482L19.9615 93.7939L23.9615 99.2939L24.8658 100.537V88.293L19.7105 93.4482Z"
        fill="#E5E5E5"
      />
      <path
        className="right-arm-shadow"
        d="M57.8666 98.5L58.3666 102.5C65.8661 98.5003 60.8667 102 66.8666 97C68.3665 95.7498 69.8663 91.9998 68.3666 89C65.8666 86.0001 62.3663 85.4999 55.3666 83L57.8666 98.5ZM61.4877 87.5146L63.4877 88.0146L63.6429 88.0537L63.7465 88.1748L66.7465 91.6748L67.0238 91.998L66.7484 92.3232L61.2484 98.8232L60.2972 99.9473L60.3676 98.4766L60.8676 87.9766L60.8959 87.3672L61.4877 87.5146Z"
        fill="#E5E5E5"
      />
      <path
        className="left-leg-shadow"
        d="M28.866 110.5L32.366 110C32.366 110 31.616 118.741 31.866 125C32.116 131.259 32.866 132 32.866 132L27.866 130.448L28.866 110.5Z"
        fill="black"
        fillOpacity="0.1"
      />
      <path
        className="right-leg-shadow"
        d="M60.866 110.5L57.366 110C57.366 110 58.616 118.741 58.366 125C58.116 131.259 57.866 132.5 57.866 132.5L61.866 130.448L60.866 110.5Z"
        fill="black"
        fillOpacity="0.1"
      />
      <path
        className="leg-lines"
        d="M28.8661 110.5L27.2455 131.612C27.2455 131.612 29.6068 133 34.8016 133C39.9964 133 41.8855 131.612 41.8855 131.612L43.6092 119.5H47.3661L48.9693 131.612C48.9693 131.612 51.3306 133 56.5254 133C61.7202 133 63.6092 131.612 63.6092 131.612L60.3661 109.5"
        stroke="black"
        strokeWidth="3"
      />
      <path
        className="right-arm-lines"
        d="M59.366 75.5C67.0701 75.9932 76.8794 84.0688 75.8661 91.5C74.3661 102.5 62.0479 109.136 58.8661 110.5"
        stroke="black"
        strokeWidth="3"
      />
      <path
        className="left-arm-lines"
        d="M24.3661 75C15.8661 81.5 9.36608 85.5 9.36607 93.5C9.36605 101.067 24.6796 109.886 30.3661 111.5"
        stroke="black"
        strokeWidth="3"
      />
      <path
        className="right-armpit-lines"
        d="M57.3661 102.5C61.154 99.3182 66.3659 93.8182 66.3659 92C66.3659 90.1818 63.1545 88 59.9727 87.0909C60.8818 89.8182 61.6454 96.7272 61.6454 98.9091"
        stroke="black"
        strokeWidth="2"
      />
      <path
        className="left-armpit-lines"
        d="M25.366 100.304C25.366 100.304 24.7963 96.6869 24.614 93.478C24.4317 90.269 24.614 88.9091 24.614 88.9091C24.614 88.9091 19.9728 90.9559 19.9728 93.478C19.9728 96 26.9733 102.073 30.866 103.5"
        stroke="black"
        strokeWidth="2"
      />
      <path
        className="belly-lines"
        d="M36.3364 110C39.5646 111.372 47.3568 113.293 52.7001 110"
        stroke="black"
        strokeWidth="2"
      />

      <g className="eye-lashes">
        <path
          d="M23.3365 10.7703L28.3365 18.9521M44.4223 5.52566L44.0683 14.2997"
          stroke="black"
          strokeWidth="3"
        />
        <path d="M64.8661 11L60.9184 18.2848" stroke="black" strokeWidth="3" />
      </g>

      {/* Eye outline with id so we can clip */}
      <path
        id="sclera"
        className="eye-outer-line"
        d="M47.5489 14.0295C66.913 16.9775 80.2141 34.3564 77.4166 52.7314C74.6191 71.1064 56.7489 83.7395 37.3847 80.7914C18.0209 77.8431 4.72049 60.4645 7.51797 42.0897C10.3155 23.7148 28.185 11.0816 47.5489 14.0295Z"
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
      <clipPath id="eyeClip">
        <use href="#sclera" />
      </clipPath>
      <clipPath id="irisClip">
        <use href="#irisArea" />
      </clipPath>

      {/* Iris + pupil group that moves */}
      <g ref={trackerRef} id="tracker" className="iris-group" clipPath="url(#eyeClip)">
        <path
          ref={irisAreaRef}
          id="irisArea"
          className="iris-bg"
          d="M48.9754 28.9202C59.2537 32.0249 64.9089 42.9211 61.5801 53.2719C58.2512 63.6225 47.2095 69.4754 36.9311 66.371C26.6527 63.2664 20.9967 52.3699 24.3255 42.019C27.6543 31.6682 38.6969 25.8156 48.9754 28.9202Z"
          fill="#D4D6E7"
        />
        <path
          className="iris-bg-2"
          d="M48.9754 28.9202C59.2537 32.0249 64.9089 42.9211 61.5801 53.2719C58.2512 63.6225 47.2095 69.4754 36.9311 66.371C26.6527 63.2664 20.9967 52.3699 24.3255 42.019C27.6543 31.6682 38.6969 25.8156 48.9754 28.9202Z"
          fill="#B659F4"
          fillOpacity="0.2"
        />
        <path
          className="iris-outer-line"
          d="M48.9754 28.9202C59.2537 32.0249 64.9089 42.9211 61.5801 53.2719C58.2512 63.6225 47.2095 69.4754 36.9311 66.371C26.6527 63.2664 20.9967 52.3699 24.3255 42.019C27.6543 31.6682 38.6969 25.8156 48.9754 28.9202Z"
          stroke="black"
          strokeWidth="2"
        />
        <path
          className="pupil"
          d="M31.6699 45.6734C33.4943 40.0007 39.4812 36.7633 45.042 38.4429C50.6026 40.1227 53.631 46.0828 51.8066 51.7554C49.9823 57.428 43.9962 60.6652 38.4355 58.9859C32.8749 57.3063 29.8458 51.346 31.6699 45.6734Z"
          fill="black"
        />
        <circle
          ref={shineRef}
          id="shine"
          cx="34"
          cy="38"
          r="5.4"
          fill="#CEBDEA"
          clipPath="url(#irisClip)"
        />
      </g>

      {/* Clipped eyelids area (for animation if needed) */}
      <g id="eyelids" className="eyelids" clipPath="url(#eyeClip)">
        <g ref={eyelidsGroupRef} className="eyelids-group">
          <path
            d="M2.00001 73.6803C49 91 80.5 90 124.5 73.6803L124.5 136L2 136L2.00001 73.6803Z"
            fill="white"
            stroke="black"
            strokeWidth="3"
            className="eyelidLower"
          />
          <path
            d="M2 73.6803C49 91 80.5 90 124.5 73.6803L124.5 2L2.00001 1.99999L2 73.6803Z"
            fill="white"
            stroke="black"
            strokeWidth="3"
            className="eyelidUpper"
          />
        </g>
      </g>

      {/* outline redraw on top */}
      <path
        className="eye-outer-line"
        d="M47.5489 14.0295C66.913 16.9775 80.2141 34.3564 77.4166 52.7314C74.6191 71.1064 56.7489 83.7395 37.3847 80.7914C18.0209 77.8431 4.72049 60.4645 7.51797 42.0897C10.3155 23.7148 28.185 11.0816 47.5489 14.0295Z"
        stroke="black"
        strokeWidth="3"
      />

      <path
        className="eye-shadow"
        d="M37.6987 13.8135C27.6265 21.0256 18.0708 30.841 15.5718 41.9082C14.3309 47.4041 14.8204 53.2434 17.9009 59.3047C20.9914 65.3856 26.716 71.739 36.0249 78.1777L38.6597 80H35.5093C15.8342 73.9688 3.17521 57.9577 6.21924 41.127C8.86444 26.5023 22.6109 15.4382 39.8911 12.2441L37.6987 13.8135Z"
        fill="black"
        fillOpacity="0.1"
      />
    </svg>
  );
};

export default EyeSVG;