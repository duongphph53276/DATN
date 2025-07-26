

import { Link } from 'react-router-dom';
import { allProducts } from '../../../../mock/allProduct';
import kidProducts from '../../../../mock/kidProducts';
import Kid from '../../../file/Kid';

const KidSection  = () => (
  <section className="py-10 bg-white">
    <h2 className="text-center text-rose-500 font-bold text-3xl mb-6">GẤU BÔNG KIDS</h2>
    <div className="flex flex-wrap justify-center gap-6 px-4">
      {kidProducts.map((product, i) => (
        <Kid key={i} {...product} />
      ))}
    </div>
  </section>
);
{allProducts.map(product => (
  <Link to={`/product/${product.id}`}>
    <img src={product.image} alt={product.name} className="rounded-lg w-full h-[250px] object-cover" />
    <h3 className="mt-2 font-semibold text-base">{product.name}</h3>
  </Link>
))}
export default KidSection;
