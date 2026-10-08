import { Outlet } from "react-router";
import Footer from "../../components/Footer/Footer.jsx";
import MobileHeader from "../../components/MobileHeader/MobileHeader.jsx";
import PageTransition from "../../components/PageTransition/PageTransition.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import SkipLink from "../../components/SkipLink/SkipLink.jsx";
import { useEffects } from "../../context/EffectsContext.js";
import CursorTrail from "../../effects/CursorTrail/CursorTrail.jsx";
import useRouteFocus from "../../hooks/useRouteFocus.js";
import styles from "./RootLayout.module.css";

/** Shared page frame. The matching child route is rendered where <Outlet /> is. */
export default function RootLayout() {
  useRouteFocus();
  const { effectsOn } = useEffects();

  return (
    <div className={styles.layout}>
      <SkipLink />
      {/* CSS shows the mobile header below 1024px and the sidebar above. */}
      <MobileHeader />
      <Sidebar />
      <div className={styles.content}>
        <main id="main" className={styles.main}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
      </div>
      {/* Not rendered at all when the effects are off, so nothing runs. */}
      {effectsOn && <CursorTrail />}
    </div>
  );
}
