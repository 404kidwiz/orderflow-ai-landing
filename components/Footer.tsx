"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Github, Twitter, Linkedin } from "lucide-react";
import styles from "./Footer.module.css";

const LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Demo", href: "#demo" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const SOCIAL = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <a href="#" className={styles.logo}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="10" width="4" height="8" rx="2" fill="#FF6B35" />
                <rect x="8" y="6" width="4" height="16" rx="2" fill="#FF6B35" />
                <rect x="14" y="8" width="4" height="12" rx="2" fill="#FF6B35" />
                <rect x="20" y="4" width="4" height="20" rx="2" fill="#FF6B35" />
              </svg>
              <span>OrderFlow</span>
            </a>
            <p className={styles.tagline}>
              The AI voice agent that takes orders while you sleep.
            </p>

            <div className={styles.contact}>
              <a href="tel:+17705255393" className={styles.contactItem}>
                <Phone size={16} />
                +1 (770) 525-5393
              </a>
              <a href="mailto:hello@orderflow.ai" className={styles.contactItem}>
                <Mail size={16} />
                hello@orderflow.ai
              </a>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                Atlanta, GA
              </div>
            </div>
          </div>

          {/* Links */}
          <div className={styles.linkGroup}>
            <h4 className={styles.linkTitle}>Product</h4>
            <ul className={styles.linkList}>
              {LINKS.product.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.linkTitle}>Company</h4>
            <ul className={styles.linkList}>
              {LINKS.company.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.linkTitle}>Legal</h4>
            <ul className={styles.linkList}>
              {LINKS.legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} OrderFlow AI. All rights reserved.
          </p>
          <div className={styles.social}>
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className={styles.socialLink}
                aria-label={s.label}
              >
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}