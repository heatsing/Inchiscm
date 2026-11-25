import Link from "next/link";
import { SiteNavigation } from "./SiteNavigation";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className={`shell header-inner ${styles.inner}`}>
        <SiteNavigation />
        <Link className={`brand ${styles.brand}`} href="/" aria-label="Inch is CM home">
          <span className="brand-mark" aria-hidden="true">↔</span>
          Inch is CM
        </Link>
      </div>
    </header>
  );
}
