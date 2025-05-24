import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Routers from "../routes/Routers";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen w-full ">
      <Header />
      <main className="flex-1 w-full overflow-x-auto">
        <Routers />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
