import Header from './components/common/DeepSearch/Header'
import Footer from './components/common/DeepSearch/Footer'
import Loader from './components/common/DeepSearch/Loader'
// import Formrenderer from './components/common/DeepSearch/Formrenderer'
import "./"
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col pt-16 bg-grid scale-150">
      {/* Header */}
      <Header />

      {/* Loader */}
      <div className="flex-grow flex items-center justify-center">
        <Loader />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
