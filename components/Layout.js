import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
