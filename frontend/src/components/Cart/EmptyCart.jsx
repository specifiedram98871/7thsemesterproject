import { Link } from 'react-router-dom';

const EmptyCart = () => {
    return (
        <div className="flex items-center flex-col gap-2 m-6">
            <div className="w-52 h-44">
                <img draggable="false" className="w-full h-full object-contain" src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-download-in-svg-png-gif-file-formats--shopping-ecommerce-simple-error-state-pack-user-interface-illustrations-6024626.png?f=webp" alt="Empty Cart" />
            </div>
            <span className="text-lg">Your cart is empty!</span>
            <p className="text-xs">Add items to it now.</p>
            <Link to="/products" className="bg-primary-green text-sm text-white px-12 py-2 rounded-sm shadow mt-3">Shop Now</Link>
        </div>
    );
};

export default EmptyCart;
