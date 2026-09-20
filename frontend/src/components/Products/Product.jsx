import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { getDiscount } from '../../utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import { useSnackbar } from 'notistack';

const Product = ({ _id, name, images, ratings, numOfReviews, price, cuttedPrice }) => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);

    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    const addToWishlistHandler = () => {
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Remove From Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added To Wishlist", { variant: "success" });
        }
    }

    return (
        <article className="group relative mx-1 my-2 flex min-h-[20rem] min-w-0 flex-col overflow-hidden rounded-[26px] border border-[#f0dfcf] bg-white/90 p-3 shadow-[0_14px_35px_rgba(80,45,18,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(80,45,18,0.15)] sm:min-h-[22rem] sm:p-4">
            {/* <!-- image & product title --> */}
            <Link to={`/product/${_id}`} className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div className="flex h-40 w-full items-center justify-center rounded-[22px] bg-gradient-to-br from-[#fff4e9] to-[#ffe3cb] p-3 sm:h-44 sm:p-4">
                    <img draggable="false" className="h-full w-full object-contain drop-shadow-[0_14px_16px_rgba(0,0,0,0.12)] transition duration-300 group-hover:scale-105" src={images && images[0].url} alt={name} />
                </div>
                <h2 className="mt-3 min-h-[2.5rem] w-full overflow-hidden break-words text-left text-sm font-medium leading-5 text-[#302016] group-hover:text-primary-green">{name.length > 85 ? `${name.substring(0, 85)}...` : name}</h2>
            </Link>
            {/* <!-- image & product title --> */}

            {/* <!-- product description --> */}
            <div className="flex min-w-0 flex-col items-center gap-3">
                {/* <!-- rating badge --> */}
                <span className="flex items-center gap-2 text-sm font-medium text-[#8b5a2b]">
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#22170f] px-2.5 py-1 text-xs font-semibold text-white">{ratings.toFixed(1)} <StarIcon sx={{ fontSize: "14px" }} /></span>
                    <span>({numOfReviews.toLocaleString()})</span>
                </span>
                {/* <!-- rating badge --> */}

                {/* <!-- price container --> */}
                <div className="flex min-w-0 flex-wrap items-end justify-center gap-x-2 gap-y-0.5 text-md font-semibold text-[#22170f]">
                    <span className="whitespace-nowrap">Rs.{price.toLocaleString()}</span>
                    <span className="whitespace-nowrap text-xs font-normal text-[#8b5a2b] line-through">Rs.{cuttedPrice.toLocaleString()}</span>
                    <span className="whitespace-nowrap text-xs font-semibold text-[#c2410c]">{getDiscount(price, cuttedPrice)}% off</span>
                </div>
                {/* <!-- price container --> */}
            </div>
            {/* <!-- product description --> */}

            {/* <!-- wishlist badge --> */}
            <button type="button" aria-label={itemInWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`} onClick={addToWishlistHandler} className={`${itemInWishlist ? "text-red-500" : "text-[#d1b8a5] hover:text-red-500"} absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm transition sm:right-4 sm:top-4`}><FavoriteIcon sx={{ fontSize: "18px" }} /></button>
            {/* <!-- wishlist badge --> */}

        </article>
    );
};

export default Product;
