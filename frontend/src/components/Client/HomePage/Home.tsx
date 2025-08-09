import Banner from "../../../layout/Client/Banner";
// import ProductFilters from "../../../layout/Client/ProductFilters";
import NewProduct from "./sections/NewProduct";
import CategorySection from "./sections/CategorySection";
import BestSelling from "./sections/BestSelling";
import OtherProduct from "./sections/OtherProduct";
import GoodSection from "./sections/GoodSection";
import HottrendSection from "./sections/HottrendSection";
import KidSection from "./sections/KidSection";
import SaleSection from "./sections/SaleSection";


const Home = () => {
  return (
    <>
      <Banner />
      {/* <ProductFilters onFilter={() => {}} /> */}
      <CategorySection />
      <BestSelling />
      <NewProduct />
      <OtherProduct />
      {/* <HottrendSection /> */}
      {/* <KidSection /> */}
      {/* <SaleSection/> */}
      {/* <GoodSection/>    */}
      {/* Thêm section khác nếu có */}
    </>
  );
};

export default Home;
