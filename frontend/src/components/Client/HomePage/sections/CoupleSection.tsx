import ProductCard from '../../../file/ProductCard';
import coupleProducts from '../../../../mock/coupleProducts';
import { allProducts } from '../../../../mock/allProduct';
import { Link } from 'react-router-dom';

const CoupleSection = () => (
  <section className="py-10 bg-white">
    <h2 className="text-center text-rose-500 font-bold text-3xl mb-6">GẤU BÔNG COUPLE</h2>
    <div className="flex flex-wrap justify-center gap-6 px-4">
      {coupleProducts.map((product, i) => (
        <ProductCard key={i} {...product} />
      ))}
    </div>
  </section>
);
{allProducts.map(product => (
  <Link to={`/product/${product.id}`}>
  <img src={product.image} alt={product.name} className="rounded-lg w-full h-[250px] object-cover" />
  <h3 className="mt-2 font-semibold text-base mh-[48px]">{product.name}</h3>
</Link>
))}
export default CoupleSection;
