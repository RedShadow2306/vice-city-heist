/**
 * DaemonLogo.jsx
 * Authentic DAEMON '26 Official Fest Logo matching the Main Association Website
 */
import React from "react";
import { getAssetUrl } from "../utils/assetPath";
import "./DaemonLogo.css";

export default function DaemonLogo({
  className = "",
  size = "md", // "sm" | "md" | "lg"
  showSubtitle = true,
  showIcon = true,
  layout = "horizontal", // "horizontal" | "vertical"
  onClick,
}) {
  return (
    <div
      className={`daemon-logo-root daemon-size-${size} ${layout} ${className}`}
      onClick={onClick}
    >
      {/* Official Fest Emblem */}
      {showIcon && (
        <div className="daemon-emblem-wrap">
          <div className="daemon-emblem-glow" />
          <img
            src={getAssetUrl("/daemon-logo.png")}
            alt="DAEMON '26 Official Emblem"
            className="daemon-emblem-img"
            loading="eager"
            onError={(e) => {
              // fallback to SVG if PNG fails
              if (!e.target.src.endsWith(".svg")) {
                e.target.src = getAssetUrl("/daemon-logo.svg");
              }
            }}
          />
        </div>
      )}

      {/* Typography Lockup */}
      <div className="daemon-text-lockup">
        <h2 className="daemon-title-text">VYUHA</h2>

        {showSubtitle && (
          <div className="daemon-script-wrap">
            <span className="daemon-script-text">
              by Daemon <span className="script-year">’26</span>
            </span>
            <div className="daemon-script-underline" />
          </div>
        )}
      </div>
    </div>
  );
}
