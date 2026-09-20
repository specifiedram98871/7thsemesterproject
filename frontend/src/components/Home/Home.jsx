import { useEffect } from 'react';
import Categories from '../Layouts/Categories';
import Banner from './Banner/Banner';
import DealSlider from './DealSlider/DealSlider';
import ProductSlider from './ProductSlider/ProductSlider';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getSliderProducts } from '../../actions/productAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import { Link } from 'react-router-dom';

const Home = () => {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { error, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Pizza House | Fresh Baked Flavor" />
      <Categories />
      <main className="site-shell flex flex-col gap-8 pt-6 pb-16 sm:pt-8">
        <section className="overflow-hidden rounded-[32px] bg-[#22170f] text-white shadow-[0_28px_80px_rgba(32,17,8,0.3)]">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <div className="flex flex-col justify-center gap-6 px-6 py-10 sm:px-10 lg:col-span-5 lg:py-14">
              <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-orange-100">
                Oven-hot, hand-tossed, unforgettable
              </span>
              <div className="space-y-4">
                <h1 className="max-w-lg text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Pizza nights made to feel like a ritual.
                </h1>
                <p className="max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                  Discover bold toppings, silky mozzarella, and crisp crusts served through a smoother ordering flow that feels as good as the food tastes.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="pill-button-primary">
                  Explore the menu
                </Link>
                <Link to="/cart" className="pill-button-secondary">
                  Review cart
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                  <p className="text-2xl font-semibold text-orange-100">24/7</p>
                  <p className="text-white/65">Fresh prep</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                  <p className="text-2xl font-semibold text-orange-100">3</p>
                  <p className="text-white/65">Signature styles</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                  <p className="text-2xl font-semibold text-orange-100">100%</p>
                  <p className="text-white/65">Cheese pull</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 lg:p-4">
              <Banner />
            </div>
          </div>
        </section>

        <DealSlider title={"Chef's Specials"} />
        {!loading && <ProductSlider title={"Suggested for You"} tagline={"Hand-picked from your cravings"} />}
      </main>
    </>
  );
};

export default Home;
