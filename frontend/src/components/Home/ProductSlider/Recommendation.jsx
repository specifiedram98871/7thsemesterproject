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
    console.error("Error fetching user:", userError);
    return <div>Error fetching user</div>;
  }

  if (recommendedError) {
    console.error("Error fetching recommendations:", recommendedError);
    return <div className="hidden">Error fetching recommendations</div>;
  }

  if (!user || !user._id) {
    return <div className="hidden">No user data available</div>;
  }

  if (!recommended || recommended.length === 0) {
    console.log("No recommendations available", user);
    return <div>No recommendations available</div>;
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
