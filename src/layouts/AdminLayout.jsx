import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function AdminLayout({ children }) {
  return (
    <>
      <Header />
      <main className="admin-layout-main">{children}</main>
      <Footer />
    </>
  );
}

export default AdminLayout;
