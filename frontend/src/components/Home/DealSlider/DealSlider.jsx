import Product from './Product';
import Slider from 'react-slick';
import { NextBtn, PreviousBtn } from '../Banner/Banner';
import { Link } from 'react-router-dom';
import { offerProducts } from '../../../utils/constants';
import { getRandomProducts } from '../../../utils/functions';

export const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 1,
    swipe: false,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const DealSlider = ({ title }) => {
    return (
        <section className="warm-card overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-[#f0dfcf] px-5 py-4 sm:px-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#c2410c]">Limited time</p>
                    <h1 className="text-2xl font-semibold text-[#22170f]">{title}</h1>
                </div>
                <Link to={`/products?category=${title}`} className="rounded-full bg-[#22170f] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_25px_rgba(34,23,15,0.18)] transition hover:-translate-y-0.5 hover:bg-[#c2410c]">View all</Link>
            </div>

            <Slider {...settings} className="px-1 py-2">
                {getRandomProducts(offerProducts, 12).map((item, i) => (
                   <Product {...item} key={i}/>
                ))}
            </Slider>
        </section>
    );
};

export default DealSlider;
