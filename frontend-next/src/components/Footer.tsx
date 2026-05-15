"use client";

import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { settingsApi } from "../services/api";
import "../style/Footer.css";

interface FooterData {
  description: string;
  facebook: string;
  instagram: string;
  youtube: string;
  email: string;
}

const DEFAULTS: FooterData = {
  description: "Your trusted local tech repair service. Quality repairs at affordable prices.",
  facebook: "https://www.facebook.com/thetechnextdoors",
  instagram: "https://www.instagram.com",
  youtube: "https://www.youtube.com",
  email: "tthetechnextdoors@gmail.com",
};

function Footer(): JSX.Element {
  const [data, setData] = useState<FooterData>(DEFAULTS);

  useEffect(() => {
    settingsApi.get("footer")
      .then((res) => {
        if (res.data) {
          try {
            const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            setData({ ...DEFAULTS, ...parsed });
          } catch { /* use defaults */ }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="footer" style={{ fontWeight: 600 }}>
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">The Tech Next Door</h3>
          <p className="footer-description">{data.description}</p>
          <p className="footer-phone">
            <a href="tel:+16144186756">(614) 418-6756</a>
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/">Services</Link></li>
            <li><Link href="/contactus">Contact</Link></li>
            <li><Link href="/getaquote">Get Free Quote</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Connect With Us</h4>
          <div className="footer-social">
            {data.facebook && <a href={data.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
            {data.instagram && <a href={data.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {data.youtube && <a href={data.youtube} target="_blank" rel="noopener noreferrer">Youtube</a>}
            {data.email && <a href={`mailto:${data.email}`} target="_blank" rel="noopener noreferrer">Email</a>}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} The Tech Next Door | All rights reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;