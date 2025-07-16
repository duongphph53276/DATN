import Banner from "../../../layout/Client/Banner";
// import ProductFilters from "../../../layout/Client/ProductFilters";
import BlindboxSection from "./sections/BlindboxSection";
import CategorySection from "./sections/CategorySection";
import CoupleSection from "./sections/CoupleSection";
import GiantSection from "./sections/GiantSection";
import GoodSection from "./sections/GoodSection";
import HottrendSection from "./sections/HottrendSection";
import KidSection from "./sections/KidSection";
import SaleSection from "./sections/SaleSection";


const Home = () => {
  return (
    <>
      <Banner />
      {/* <ProductFilters onFilter={() => {}} /> */}
    <CategorySection/>
    <CoupleSection />
    <HottrendSection/>
    <KidSection />
    <SaleSection/>
    <GiantSection/>
    <GoodSection/>
    <BlindboxSection/>
      {/* Thêm section khác nếu có */}
    </>
  );
};

export default Home;
