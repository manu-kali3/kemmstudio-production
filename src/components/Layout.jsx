import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingSocials from './FloatingSocials';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main id="main"><Outlet /></main>
      <Footer />
      <FloatingSocials />
    </>
  );
}
