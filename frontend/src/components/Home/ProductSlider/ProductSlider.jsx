import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { getRandomProducts } from '../../../utils/functions';
import { settings } from '../DealSlider/DealSlider';
import Product from './Product';
import Recommendation from './Recommendation';

const suggestedSettings = {
    ...settings,
    slidesToShow: 4,
    slidesToScroll: 4,
    swipe: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: { slidesToShow: 3, slidesToScroll: 3 },
        },
        {
            breakpoint: 600,
            settings: { slidesToShow: 2, slidesToScroll: 2 },
        },
        {
            breakpoint: 480,
            settings: { slidesToShow: 1, slidesToScroll: 1 },
        },
    ],
};

const ProductSlider = ({ title, tagline }) => {
    const { loading, products } = useSelector((state) => state.products);

    // Retrieve categories from session storage
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    const combinedFilters = [...new Set([...categories, ...searches])];
   

    // Filter products based on the retrieved categories
    const filteredProducts = products?.filter(product => combinedFilters.includes(product.category));

    return (
        <section className="warm-card overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-[#f0dfcf] px-5 py-4 sm:px-6">
                <div className="title flex flex-col gap-1">
                    <p className="text-xs uppercase tracking-[0.28em] text-[#c2410c]">Personalized picks</p>
                    <h1 className="text-2xl font-semibold text-[#22170f]">{title}</h1>
                    <p className="text-sm text-[#8b5a2b]">{tagline}</p>
                </div>
                <Link to="/products" className="rounded-full border border-[#edd9c7] bg-[#fff5eb] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b5a2b] shadow-sm transition hover:bg-[#f7e8d8]">View all</Link>
            </div>
            {loading ? null : (
                <Slider {...suggestedSettings} className="px-1 py-3">
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
