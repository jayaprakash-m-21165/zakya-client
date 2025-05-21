import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function DefaultLayout({ children, disableScroll = false }) {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        <Sidebar isOpen={true} />
        <main className={`flex-1 transition-all ml-[5rem] md:ml-[5rem] ${disableScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className={`px-6 py-4 ${disableScroll ? 'h-full overflow-hidden' : 'min-h-[calc(100vh-104px)]'}`}>
            {children}
          </div>
        </main>        
      </div>
    </div>
  );
}
