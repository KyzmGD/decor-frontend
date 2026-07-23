import { useLocation } from "react-router-dom";

import Header
  from "../components/Header";

import Footer
  from "../components/Footer";

function MainLayout({
  children
}) {
  const location = useLocation();

  return (
    <div
      className="
        flex
        min-h-screen
        flex-col
        bg-slate-50
        text-slate-900
        transition-colors
        dark:bg-slate-950
        dark:text-slate-100
      "
    >
      <Header />

      <main
        key={location.pathname}
        className="page-enter flex-1"
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
