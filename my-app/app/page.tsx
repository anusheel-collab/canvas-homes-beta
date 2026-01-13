import Header from "./components/common/DeepSearch/Header";
import Footer from "./components/common/DeepSearch/Footer";
import Loader from "./components/common/DeepSearch/Loader";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-grid relative">
        {/* Loader with high z-index */}
        <div className="w-full mt-[36px] relative z-[60]">
          <Loader />
        </div>

        {/* Rest of content */}
        <div className="h-full flex items-center justify-center">
          {/* Your main content here */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
