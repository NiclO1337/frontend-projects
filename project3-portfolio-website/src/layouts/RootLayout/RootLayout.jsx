import { Outlet } from "react-router";
import MobileHeader from "../../components/MobileHeader/MobileHeader.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import useRouteFocus from "../../hooks/useRouteFocus.js";
import styles from "./RootLayout.module.css";

/** Shared page frame. The matching child route is rendered where <Outlet /> is. */
export default function RootLayout() {
  useRouteFocus();

  return (
    <div className={styles.layout}>
      {/* CSS shows the mobile header below 1024px and the sidebar above. */}
      <MobileHeader />
      <Sidebar />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
