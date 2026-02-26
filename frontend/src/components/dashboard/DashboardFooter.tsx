import { JSX } from "react";
import "../../style/DashboardFooter.css";

function DashboardFooter(): JSX.Element {
  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-content">
        <p className="dashboard-footer-copyright">
          &copy; {new Date().getFullYear()} The Tech Next Door | Admin Dashboard
        </p>
        <p className="dashboard-footer-version">Version 1.0.0</p>
      </div>
    </footer>
  );
}

export default DashboardFooter;
