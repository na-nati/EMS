import { useAuth } from "../contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { user } = useAuth();

  // Show loading or redirect if user is not ready
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto pt-16 px-4 md:px-6">
          {/* THIS IS WHERE CHILD ROUTES WILL RENDER */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
