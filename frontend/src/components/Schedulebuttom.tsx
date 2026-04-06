import { JSX } from "react";
import "../style/Schedulebuttom.css";

interface ScheduleProps {
  onClick?: () => void;
  onSeniorTechClick?: () => void;
}

function Schedulebuttom({ onClick, onSeniorTechClick }: ScheduleProps): JSX.Element {
  return (
    <div className="schedule-button-group">
      <button className="schedule-button" onClick={onClick}>
        Schedule A Service
      </button>
      <button className="schedule-button schedule-button--senior" onClick={onSeniorTechClick}>
        Senior Tech Service
      </button>
    </div>
  );
}

export default Schedulebuttom;
