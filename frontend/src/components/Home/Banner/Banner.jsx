import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Banner.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import sale1 from '../../../assets/images/Banners/sale1.webp';
import sale2 from '../../../assets/images/Banners/sale2.jpg';
import sale3 from '../../../assets/images/Banners/sale3.jpg';
import sale4 from '../../../assets/images/Banners/sale4.webp';
import sale5 from '../../../assets/images/Banners/sale5.jpg';
import sale6 from '../../../assets/images/Banners/sale6.webp';
import sale7 from '../../../assets/images/Banners/sale7.webp';


export const PreviousBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <ArrowBackIosIcon />
    </div>
  )
}

export const NextBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <ArrowForwardIosIcon />
    </div>
  )
}

const Banner = () => {

  const settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
  };

  const banners = [sale1,sale2,sale3,sale4,sale5,sale6,sale7]

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#2b1b12] shadow-[0_24px_70px_rgba(24,15,10,0.32)]">
      <div className="absolute inset-0 hero-gradient opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_25%)]"></div>
      <div className="relative p-4 sm:p-5">
        <Slider {...settings}>
          {banners.map((el, i) => (
            <div key={i} className="relative overflow-hidden rounded-[24px]">
              <img draggable="false" className="h-56 w-full object-cover sm:h-[26rem]" src={el} alt="banner" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#22170f]/80 via-[#22170f]/30 to-transparent"></div>
              <div className="absolute left-5 top-5 max-w-sm rounded-3xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md sm:left-8 sm:top-8">
                <p className="text-xs uppercase tracking-[0.32em] text-orange-100">Fresh from the oven</p>
                <h3 className="mt-3 text-2xl font-semibold sm:text-4xl">Handcrafted pizzas, warm lighting, zero clutter.</h3>
                <p className="mt-3 text-sm leading-6 text-white/75">A softer, more inviting storefront that keeps the food front and center.</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Banner;
