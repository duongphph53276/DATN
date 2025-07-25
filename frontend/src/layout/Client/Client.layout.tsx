import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />

    <main className="flex-1">
      <Outlet />
    </main>

    <Footer />
  </div>
);

export default ClientLayout;
