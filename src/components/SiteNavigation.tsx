"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import styles from "./SiteHeader.module.css";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/inches-to-cm", label: "Inches to CM" },
  { href: "/cm-to-inches", label: "CM to Inches" },
  { href: "/length-converters", label: "Length Converters" },
  { href: "/height-tools", label: "Height Converters" },
  { href: "/inches-to-cm-dimensions", label: "Dimensions Converters" },
  { href: "/screen-tools", label: "Screen Size Tools" },
  { href: "/fraction-converters", label: "Fraction Converters" },
  { href: "/conversion-charts", label: "Conversion Charts" },
  { href: "/measurement-guides", label: "Measurement Guides" },
  { href: "/game", label: "Measurement Quiz" },
] as const;

export function SiteNavigation() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function openNavigation() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setIsOpen(true);
  }

  function closeNavigation() {
    dialogRef.current?.close();
  }

  function restoreFocus() {
    setIsOpen(false);
    openButtonRef.current?.focus({ preventScroll: true });
  }

  function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const closeButton = closeButtonRef.current;
    const lastLink = event.currentTarget.querySelector<HTMLAnchorElement>("li:last-child a");
    if (event.shiftKey && event.target === closeButton && lastLink) {
      event.preventDefault();
      lastLink.focus();
    } else if (!event.shiftKey && event.target === lastLink && closeButton) {
      event.preventDefault();
      closeButton.focus();
    }
  }

  return (
    <>
      <button
        ref={openButtonRef}
        className={styles.menuButton}
        type="button"
        aria-label="Open navigation"
        aria-haspopup="dialog"
        aria-controls="site-navigation"
        aria-expanded={isOpen}
        onClick={openNavigation}
      >
        <span className={styles.menuIcon} aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        id="site-navigation"
        className={styles.drawer}
        aria-label="Site navigation"
        onClose={restoreFocus}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeNavigation();
        }}
        onKeyDown={keepFocusInside}
      >
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>Menu</span>
            <button
              ref={closeButtonRef}
              className={styles.closeButton}
              type="button"
              aria-label="Close navigation"
              onClick={closeNavigation}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav className={styles.navigation} aria-label="Primary navigation">
            <ul className={styles.links}>
              {navigationLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} prefetch={false} aria-current={pathname === href ? "page" : undefined} onClick={closeNavigation}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
