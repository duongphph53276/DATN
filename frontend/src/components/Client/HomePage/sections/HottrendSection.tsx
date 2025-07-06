
import Hottrend from '../../../file/HotTrendProductList';
import hottrendProducts from '../../../../mock/hottrentProducts';


const HottrendSection = () => (
  <section className="py-10 bg-white">
    <h2 className="text-center text-rose-500 font-bold text-3xl mb-6">GẤU BÔNG HOT TREND</h2>
    <div className="flex flex-wrap justify-center gap-6 px-4">
      {hottrendProducts.map((product, i) => (
        <Hottrend key={i} {...product} />
      ))}
    </div>
  </section>
);

export default HottrendSection;
