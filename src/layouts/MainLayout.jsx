import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar/TopBar";

export default function MainLayout() {
  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
}
