import Header
  from "../components/Header";

import Footer
  from "../components/Footer";

function MainLayout({
  children
}) {
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

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;