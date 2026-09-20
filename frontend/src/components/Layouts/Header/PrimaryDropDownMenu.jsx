import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { logoutUser } from '../../../actions/userAction';

const PrimaryDropDownMenu = ({ setTogglePrimaryDropDown, user }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
        enqueueSnackbar("Logout Successfully", { variant: "success" });
        setTogglePrimaryDropDown(false);
    }

    const navs = [
        {
            title: "Orders",
            icon: <ShoppingBagIcon sx={{ fontSize: "18px" }} />,
            redirect: "/orders",
        },
        {
            title: "Wishlist",
            icon: <FavoriteIcon sx={{ fontSize: "18px" }} />,
            redirect: "/wishlist",
        },
 
        
    ]

    return (
        <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-3xl border border-white/20 bg-[#fff8f0] shadow-[0_24px_50px_rgba(52,28,15,0.2)] backdrop-blur-xl">
            <div className="border-b border-[#edd9c7] bg-gradient-to-r from-[#7c2d12] to-[#c2410c] px-5 py-4 text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-orange-100/90">Welcome back</p>
                <p className="mt-1 text-lg font-semibold">{user?.name}</p>
                <p className="text-sm text-white/75">Your table, orders and favorites in one place.</p>
            </div>

            <div className="flex flex-col text-sm">
                {user && user.role === "admin" &&
                    <Link className="flex gap-3 items-center px-5 py-3.5 font-medium text-[#3a2418] transition hover:bg-[#f7e8d8]" to="/admin/dashboard">
                        <span className="text-[#c2410c]"><DashboardIcon sx={{ fontSize: "18px" }} /></span>
                        Admin Dashboard
                    </Link>
                }
                {user && user.role === "waiter" &&
                    <Link className="flex gap-3 items-center px-5 py-3.5 font-medium text-[#3a2418] transition hover:bg-[#f7e8d8]" to="/waiter/dashboard">
                        <span className="text-[#c2410c]"><DashboardIcon sx={{ fontSize: "18px" }} /></span>
                        Waiter Dashboard
                    </Link>
                }

                <Link className="flex gap-3 items-center border-y border-[#edd9c7] px-5 py-3.5 font-medium text-[#3a2418] transition hover:bg-[#f7e8d8]" to="/account">
                    <span className="text-[#c2410c]"><AccountCircleIcon sx={{ fontSize: "18px" }} /></span>
                    My Profile
                </Link>

                {navs.map((item, i) => {
                    const { title, icon, redirect } = item;

                    return title === "Wishlist" ? (
                        <Link key={i} className="flex items-center gap-3 border-b border-[#edd9c7] px-5 py-3.5 font-medium text-[#3a2418] transition hover:bg-[#f7e8d8]" to={redirect}>
                            <span className="text-[#c2410c]">{icon}</span>
                            {title}
                            <span className="ml-auto rounded-full bg-[#f4e6d8] px-2.5 py-0.5 text-xs font-semibold text-[#8a5b3a]">
                                {wishlistItems.length}
                            </span>
                        </Link>
                    ) : (
                        <Link key={i} className="flex gap-3 items-center border-b border-[#edd9c7] px-5 py-3.5 font-medium text-[#3a2418] transition hover:bg-[#f7e8d8]" to={redirect}>
                            <span className="text-[#c2410c]">{icon}</span>
                            {title}
                        </Link>
                    )
                })}

                <button type="button" className="flex gap-3 items-center px-5 py-3.5 text-left font-medium text-[#3a2418] transition hover:bg-[#f7e8d8]" onClick={handleLogout} >
                    <span className="text-[#c2410c]"><PowerSettingsNewIcon sx={{ fontSize: "18px" }} /></span>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default PrimaryDropDownMenu;
