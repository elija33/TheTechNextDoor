import { JSX } from "react";
import "../style/submit.css";

interface SubmitProps {
  onClick?: () => void;
  disabled?: boolean;
}

function Submit({ onClick, disabled = false }: SubmitProps): JSX.Element {
  return (
    <button
      type="submit"
      className="submit-btn"
      onClick={onClick}
      disabled={disabled}
    >
      Submit
    </button>
  );
}

export default Submit;
