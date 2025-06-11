import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';

const ClientLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      <Header />
        <Banner/>
        <hr />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default ClientLayout;