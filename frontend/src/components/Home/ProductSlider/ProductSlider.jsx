import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { getRandomProducts } from '../../../utils/functions';
import { settings } from '../DealSlider/DealSlider';
import Product from './Product';
import Recommendation from './Recommendation';

const ProductSlider = ({ title, tagline }) => {
    const { loading, products } = useSelector((state) => state.products);

    // Retrieve categories from session storage
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    const combinedFilters = [...new Set([...categories, ...searches])];
   

    // Filter products based on the retrieved categories
    const filteredProducts = products?.filter(product => combinedFilters.includes(product.category));

    return (
        <section className="bg-white w-full shadow overflow-hidden">
            {/* <!-- header --> */}
            <div className="flex px-6 py-4 justify-between items-center">
                <div className="title flex flex-col gap-0.5">
                    <h1 className="text-xl font-medium">{title}</h1>
                    <p className="text-sm text-gray-400">{tagline}</p>
                </div>
                <Link to="/products" className="bg-primary-green text-xs font-medium text-white px-5 py-2.5 rounded-sm shadow-lg uppercase">view all</Link>
            </div>
            <hr />
            {loading ? null : (
                <Slider {...settings} className="flex items-center justify-between p-1">
                    {filteredProducts && getRandomProducts(filteredProducts, 12).map((product) => (
                        <Product {...product} key={product._id} />
                    ))}
                </Slider>
            )}
            <Recommendation products={products} />
        </section>
        
    );
};

export default ProductSlider;
