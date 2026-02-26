import { JSX } from "react";
import "../style/Schedulebuttom.css";

interface ScheduleProps {
  onClick?: () => void;
}

function Schedulebuttom({ onClick }: ScheduleProps): JSX.Element {
  return (
    <button className="schedule-button" onClick={onClick}>
      Schedule A Service
    </button>
  );
}

export default Schedulebuttom;
