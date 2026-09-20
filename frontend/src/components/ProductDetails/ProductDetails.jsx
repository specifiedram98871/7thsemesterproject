import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { clearErrors, getProductDetails, getSimilarProducts, newReview } from '../../actions/productAction';
import { NextBtn, PreviousBtn } from '../Home/Banner/Banner';
import ProductSlider from '../Home/ProductSlider/ProductSlider';
import Loader from '../Layouts/Loader';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CachedIcon from '@mui/icons-material/Cached';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import { addItemsToCart } from '../../actions/cartAction';
import { getDeliveryDate, getDiscount } from '../../utils/functions';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import MinCategory from '../Layouts/MinCategory';
import MetaData from '../Layouts/MetaData';

const ProductDetails = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const navigate = useNavigate();

    // reviews toggle
    const [open, setOpen] = useState(false);
    const [viewAll, setViewAll] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const { product, loading, error } = useSelector((state) => state.productDetails);
    const { success, error: reviewError } = useSelector((state) => state.newReview);
    const { cartItems } = useSelector((state) => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const settings = {
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <PreviousBtn />,
        nextArrow: <NextBtn />,
    };

    const productId = params.id;
    const itemInWishlist = wishlistItems.some((i) => i.product === productId);

    const addToWishlistHandler = () => {
        if (itemInWishlist) {
            dispatch(removeFromWishlist(productId));
            enqueueSnackbar("Remove From Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(productId));
            enqueueSnackbar("Added To Wishlist", { variant: "success" });
        }
    }

    const reviewSubmitHandler = () => {
        if (rating === 0 || !comment.trim()) {
            enqueueSnackbar("Empty Review", { variant: "error" });
            return;
        }
        const formData = new FormData();
        formData.set("rating", rating);
        formData.set("comment", comment);
        formData.set("productId", productId);
        dispatch(newReview(formData));
        setOpen(false);
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(productId));
        enqueueSnackbar("Product Added To Cart", { variant: "success" });
    }

    const handleDialogClose = () => {
        setOpen(!open);
    }

    const itemInCart = cartItems.some((i) => i.product === productId);

    const goToCart = () => {
        navigate('/cart');
    }

    const buyNow = () => {
        addToCartHandler();
        navigate('/shipping');
    }

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (reviewError) {
            enqueueSnackbar(reviewError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (success) {
            enqueueSnackbar("Review Submitted Successfully", { variant: "success" });
            dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(productId));
        // eslint-disable-next-line
    }, [dispatch, productId, error, reviewError, success, enqueueSnackbar]);

    useEffect(() => {
        dispatch(getSimilarProducts(product?.category));
    }, [dispatch, product?.category]);

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={product.name} />
                    <MinCategory />
                    <main className="site-shell mt-6 pb-16 sm:mt-8">

                        {/* <!-- product image & description container --> */}
                        <div className="overflow-hidden rounded-[32px] border border-[#f0dfcf] bg-white shadow-[0_24px_60px_rgba(80,45,18,0.1)]">

                            {/* <!-- image wrapper --> */}
                            <div className="grid gap-0 lg:grid-cols-12">
                                <div className="bg-[#fff8f1] p-4 lg:col-span-5 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
                                    <div className="flex h-full flex-col gap-4 rounded-[28px] bg-white p-4 shadow-sm">
                                        <div className="relative overflow-hidden rounded-[24px] border border-[#f0dfcf] bg-gradient-to-br from-[#fff4e9] to-[#ffe0c4]">
                                            <Slider {...settings}>
                                                {product.images && product.images.map((item, i) => (
                                                    <img draggable="false" className="h-[22rem] w-full object-contain p-4 sm:h-[28rem]" src={item.url} alt={product.name} key={i} />
                                                ))}
                                            </Slider>
                                            <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-lg">
                                                <span onClick={addToWishlistHandler} className={`${itemInWishlist ? "text-red-500" : "text-gray-300 hover:text-red-500"} cursor-pointer`}><FavoriteIcon sx={{ fontSize: "18px" }} /></span>
                                            </div>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {product.stock > 0 && (
                                                <button onClick={itemInCart ? goToCart : addToCartHandler} className="pill-button-secondary border-[#edd9c7] bg-[#fff5eb] text-[#3a2418] hover:bg-[#f7e8d8]">
                                                    <ShoppingCartIcon />
                                                    {itemInCart ? "Go to cart" : "Add to cart"}
                                                </button>
                                            )}
                                            <button onClick={buyNow} disabled={product.stock < 1 ? true : false} className={product.stock < 1 ? "pill-button bg-red-500 text-white cursor-not-allowed" : "pill-button-primary"}>
                                                <FlashOnIcon />
                                                {product.stock < 1 ? "Out of stock" : "Buy now"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            {/* <!-- product desc wrapper --> */}
                            <div className="lg:col-span-7 px-5 py-6 sm:px-8 sm:py-8">

                                {/* <!-- whole product description --> */}
                                <div className="flex flex-col gap-4">

                                    <div className="space-y-3">
                                        <p className="text-xs uppercase tracking-[0.28em] text-[#c2410c]">Pizza House Special</p>
                                        <h2 className="text-3xl font-semibold text-[#22170f] sm:text-4xl">{product.name}</h2>
                                    </div>
                                    {/* <!-- rating badge --> */}
                                    <span className="flex items-center gap-2 text-sm font-medium text-[#8b5a2b]">
                                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[#22170f] px-2.5 py-1 text-xs font-semibold text-white">{product.ratings && product.ratings.toFixed(1)} <StarIcon sx={{ fontSize: "12px" }} /></span>
                                        <span>{product.numOfReviews} reviews</span>
                                    </span>
                                    {/* <!-- rating badge --> */}

                                    <div className="rounded-[28px] bg-[#fff7ef] p-5 shadow-sm">
                                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c2410c]">Special price</span>
                                        <div className="mt-2 flex flex-wrap items-baseline gap-3">
                                            <span className="text-4xl font-semibold text-[#22170f]">Rs.{product.price?.toLocaleString()}</span>
                                            <span className="text-base text-[#8b5a2b] line-through">Rs.{product.cuttedPrice?.toLocaleString()}</span>
                                            <span className="rounded-full bg-[#22170f] px-3 py-1 text-sm font-semibold text-white">{getDiscount(product.price, product.cuttedPrice)}% off</span>
                                        </div>
                                        {product.stock <= 10 && product.stock > 0 && (
                                            <span className="mt-3 inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">Hurry, only {product.stock} left!</span>
                                        )}
                                    </div>

                                    <div className="grid gap-4 rounded-[28px] border border-[#f0dfcf] bg-white p-5 sm:grid-cols-2">
                                        <div className="flex gap-4 text-sm">
                                            <p className="min-w-24 text-[#8b5a2b] font-medium">Best before</p>
                                            <div className="flex-1">
                                                <img draggable="false" className="h-8 w-20 rounded border border-[#f0dfcf] object-contain p-0.5" src={product.brand?.logo.url} alt={product.brand && product.brand.name} />
                                                <span className="mt-2 block text-[#3a2418]">{product.warranty} month(s)</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-sm">
                                            <p className="min-w-24 text-[#8b5a2b] font-medium">Delivery</p>
                                            <span className="text-[#3a2418]">By {getDeliveryDate()}</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 rounded-[28px] border border-[#f0dfcf] bg-white p-5 lg:grid-cols-2">
                                        <div className="flex gap-4 text-sm">
                                            <p className="min-w-24 text-[#8b5a2b] font-medium">Highlights</p>

                                            <ul className="flex flex-col gap-2 text-[#3a2418]">
                                                {product.highlights?.map((highlight, i) => (
                                                    <li key={i}>
                                                        <p>{highlight}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex gap-4 text-sm">
                                            <p className="min-w-24 text-[#8b5a2b] font-medium">Services</p>
                                            <ul className="flex flex-col gap-2 text-[#3a2418]">
                                                <li>
                                                    <p className="flex items-center gap-3"><span className="text-[#c2410c]"><VerifiedUserIcon sx={{ fontSize: "18px" }} /></span>Expires in {product.warranty} month(s)</p>
                                                </li>
                                                <li>
                                                    <p className="flex items-center gap-3"><span className="text-[#c2410c]"><CachedIcon sx={{ fontSize: "18px" }} /></span> 7 Days Replacement Policy</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 rounded-[28px] border border-[#f0dfcf] bg-[#fff7ef] p-5 text-sm font-medium">
                                        <p className="text-[#8b5a2b]">Seller</p>
                                        <Link className="font-semibold text-[#c2410c]" to="/">{product.brand && product.brand.name}</Link>
                                    </div>

                                    <div className="rounded-[28px] border border-[#f0dfcf] bg-white p-5 text-sm leading-7 text-[#3a2418]">
                                        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#c2410c]">Description</p>
                                        <span>{product.description}</span>
                                    </div>
                                    {/* <!-- description details --> */}

                                    {/* <!-- border box --> */}
                                    <div className="w-full mt-6 rounded-sm border flex flex-col">
                                        <h1 className="px-6 py-4 border-b text-2xl font-medium">Product Description</h1>
                                        <div className="p-6">
                                            <p className="text-sm">{product.description}</p>
                                        </div>
                                    </div>
                                    {/* <!-- border box --> */}

                                    {/* specifications section removed */}

                                    {/* <!-- reviews border box --> */}
                                    <div className="w-full mt-4 rounded-sm border flex flex-col">
                                        <div className="flex justify-between items-center border-b px-6 py-4">
                                            <h1 className="text-2xl font-medium">Ratings & Reviews</h1>
                                            <button onClick={handleDialogClose} className="shadow bg-primary-lGreen text-white px-4 py-2 rounded-sm hover:shadow-lg">Rate Product</button>
                                        </div>

                                        <Dialog
                                            aria-labelledby='review-dialog'
                                            open={open}
                                            onClose={handleDialogClose}
                                        >
                                            <DialogTitle className="border-b">Submit Review</DialogTitle>
                                            <DialogContent className="flex flex-col m-1 gap-4">
                                                <Rating
                                                    onChange={(e) => setRating(e.target.value)}
                                                    value={rating}
                                                    size='large'
                                                    precision={0.5}
                                                />
                                                <TextField
                                                    label="Review"
                                                    multiline
                                                    rows={3}
                                                    sx={{ width: 400 }}
                                                    size="small"
                                                    variant="outlined"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <button onClick={handleDialogClose} className="py-2 px-6 rounded shadow bg-white border border-red-500 hover:bg-red-100 text-red-600 uppercase">Cancel</button>
                                                <button onClick={reviewSubmitHandler} className="py-2 px-6 rounded bg-green-600 hover:bg-green-700 text-white shadow uppercase">Submit</button>
                                            </DialogActions>
                                        </Dialog>

                                        <div className="flex items-center border-b">
                                            <h1 className="px-6 py-3 text-3xl font-semibold">{product.ratings && product.ratings.toFixed(1)}<StarIcon /></h1>
                                            <p className="text-lg text-gray-500">({product.numOfReviews}) Reviews</p>
                                        </div>

                                        {viewAll ?
                                            product.reviews?.map((rev, i) => (
                                                <div className="flex flex-col gap-2 py-4 px-6 border-b" key={i}>
                                                    <Rating name="read-only" value={rev.rating} readOnly size="small" precision={0.5} />
                                                    <p>{rev.comment}</p>
                                                    <span className="text-sm text-gray-500">by {rev.name}</span>
                                                </div>
                                            )).reverse()
                                            :
                                            product.reviews?.slice(-3).map((rev, i) => (
                                                <div className="flex flex-col gap-2 py-4 px-6 border-b" key={i}>
                                                    <Rating name="read-only" value={rev.rating} readOnly size="small" precision={0.5} />
                                                    <p>{rev.comment}</p>
                                                    <span className="text-sm text-gray-500">by {rev.name}</span>
                                                </div>
                                            )).reverse()
                                        }
                                        {product.reviews?.length > 3 &&
                                            <button onClick={() => setViewAll(!viewAll)} className="w-1/3 m-2 rounded-sm shadow hover:shadow-lg py-2 bg-primary-green text-white">{viewAll ? "View Less" : "View All"}</button>
                                        }
                                    </div>
                                    {/* <!-- reviews border box --> */}

                                </div>

                            </div>
                            {/* <!-- product desc wrapper --> */}

                        </div>
                        </div>
                        {/* <!-- product image & description container --> */}

                        {/* Sliders */}
                        <div className="flex flex-col gap-3 mt-6">
                            <ProductSlider title={"Similar Products"} tagline={"Based on the category"} />
                        </div>

                    </main>
                </>
            )}
        </>
    );
};

export default ProductDetails;
