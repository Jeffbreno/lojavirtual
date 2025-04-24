import React from "react";
import { getOrderStatusInfo } from "../utils/orderStatus";
import "./TimelineStatus.css"; // Vamos criar esse CSS

const TimelineStatus = ({ logs = [] }) => {
  return (
    <div className="timeline-status">
      {logs.map((log, index) => {
        const { label, color, icon } = getOrderStatusInfo(log.status);
        const date = new Date(log.changed_at).toLocaleString("pt-BR");

        return (
          <div key={index} className="timeline-step">
            <div className={`timeline-icon bg-${color}`}>{icon}</div>
            <div className="timeline-content">
              <strong className={`text-${color}`}>{label}</strong>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>{date}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineStatus;
