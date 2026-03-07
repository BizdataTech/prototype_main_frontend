import Footer from "@/components/client/Footer/Footer";
import Header from "@/components/client/Header/Header";

export default function ClientLayout({ children }) {
  return (
    <main className="h-screen bg-neutral-100 flex flex-col justify-between ">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
