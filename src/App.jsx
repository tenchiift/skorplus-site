import { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import ContactChat from "./components/ContactChat";
import Footer from "./components/Footer";
import MobileMenu from "./components/MobileMenu";
import Nav from "./components/Nav";
import UserCursor from "./components/UserCursor";
import useSmoothScroll from "./lib/useSmoothScroll";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import Overview from "./pages/Overview";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);
  return null;
}

function BodyTheme() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.body.className = pathname === "/" ? "page-home" : "page-light";
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <section className="section" style={{ paddingTop: "clamp(8rem, 18vw, 14rem)", paddingBottom: "clamp(6rem, 14vw, 10rem)" }}>
      <h1 className="text-big lowercase">Page not found.</h1>
      <p className="grey-02" style={{ marginTop: "2rem" }}>
        <Link className="link-underline lowercase" to="/">
          Back to overview
          <span className="link-underline-line" aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  useSmoothScroll(menuOpen || chatOpen);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openChat = useCallback(() => {
    setMenuOpen(false);
    setChatOpen(true);
  }, []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  return (
    <>
      <UserCursor />
      <BodyTheme />
      <ScrollToTop />
      <Nav menuOpen={menuOpen} onOpenContact={openChat} onOpenMenu={toggleMenu} />
      <MobileMenu open={menuOpen} onClose={closeMenu} onOpenContact={openChat} />

      <main id="main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact onOpenContact={openChat} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer onOpenContact={openChat} />
      <ContactChat open={chatOpen} onClose={closeChat} />
    </>
  );
}
