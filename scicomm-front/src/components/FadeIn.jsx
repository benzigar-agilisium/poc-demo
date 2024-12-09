import React, { useState, useEffect } from "react";

const FadeInComponent = ({
  children,
  className = "",
  duration = 0.3,
  delay = 10,
  fadeFromBottom = false,
  show = true,
  ...rest
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      const timeout = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), duration * 1000);
      return () => clearTimeout(timeout);
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={`transition-all ${isVisible ? "opacity-100" : "opacity-0"} ${
        fadeFromBottom && !isVisible ? "translate-y-4" : ""
      } ${fadeFromBottom && isVisible ? "translate-y-0" : ""} ${className}`}
      style={{
        transitionDuration: `${duration}s`,
        transitionProperty: "opacity, transform",
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default FadeInComponent;
