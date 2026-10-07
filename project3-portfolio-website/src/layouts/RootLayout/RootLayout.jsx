import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import styles from "./RootLayout.module.css";

/** Shared page frame. The matching child route is rendered where <Outlet /> is. */
export default function RootLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
