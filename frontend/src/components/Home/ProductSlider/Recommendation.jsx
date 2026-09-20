import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { recommendProducts } from "../../../actions/productAction";
import { settings } from "../DealSlider/DealSlider";
import Product from "./Product";

const Recommendation = ({ products }) => {
  const dispatch = useDispatch();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.user);
  const {
    recommended,
    loading: recommendedLoading,
    error: recommendedError,
  } = useSelector((state) => state.recommended);

  useEffect(() => {
    if (user && user._id) {
      dispatch(recommendProducts(user._id));
    }
  }, [user, dispatch]);

  if (userLoading || recommendedLoading) {
    return <div>Loading...</div>;
  }

  if (userError) {
    // console.error("Error fetching user:", userError);
    return <div>Login to get recommendations</div>;
  }

  if (recommendedError) {
    // console.error("Error fetching recommendations:", recommendedError);
    return <div className="hidden">Error fetching recommendations</div>;
  }

  if (!user || !user._id) {
    return <div className="hidden">No user data available</div>;
  }

  if (!recommended || recommended.length === 0) {
    return (
      <section className="border-t border-[#f0dfcf] bg-[#fffaf5] px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe3cb] text-2xl text-[#c2410c] shadow-inner">
            <span aria-hidden="true">&#9733;</span>
          </div>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c2410c]">
            Personalised for you
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#22170f] sm:text-2xl">
            Your recommendations are taking shape
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[#8b5a2b]">
            Explore a few products and leave a review to help us discover picks that match your taste.
          </p>
          <Link
            to="/products"
            className="mt-5 rounded-full bg-[#c2410c] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_22px_rgba(194,65,12,0.2)] transition hover:-translate-y-0.5 hover:bg-[#a63d13]"
          >
            Browse products
          </Link>
        </div>
      </section>
    );
  }
  const rProduct = products.filter((product) => {
    return recommended.includes(product._id);
  });
  
  // console.log("Recommendation:",  rProduct);
  // console.log("Recommendation:",  recommended);

  return (
    <section className="bg-white w-full shadow overflow-hidden">
      {/* <!-- header --> */}
      <div className="flex px-6 py-4 justify-between items-center">
        <div className="title flex flex-col gap-0.5">
          <h1 className="text-xl font-medium">Recommended Products</h1>
          <p className="text-sm text-gray-400">Based on your impresssion</p>
        </div>
        <Link
          to="/products"
          className="bg-primary-green text-xs font-medium text-white px-5 py-2.5 rounded-sm shadow-lg uppercase"
        >
          view all
        </Link>
      </div>
      <hr />
      <Slider {...settings} className="flex items-center justify-between p-1">
        {rProduct.map((product) => (
          <Product {...product} key={product._id || product} />
        ))}
      </Slider>
    </section>
  );
};

export default Recommendation;
