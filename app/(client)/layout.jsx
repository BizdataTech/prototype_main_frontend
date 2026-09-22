import Footer from "@/components/client/Footer/Footer";
import Header from "@/components/client/Header/Header";
import { Toaster } from "sonner";

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <Toaster position="top-center" richColors />
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
