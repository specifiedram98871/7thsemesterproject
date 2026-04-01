import { Link, useNavigate } from 'react-router-dom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import ReviewsIcon from '@mui/icons-material/Reviews';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import './Sidebar.css';
import { useSnackbar } from 'notistack';
import { logoutUser } from '../../../actions/userAction';

const navMenu = [
    {
        icon: <EqualizerIcon />,
        label: "Dashboard",
        ref: "/admin/dashboard",
    },
    {
        icon: <ShoppingBagIcon />,
        label: "Orders",
        ref: "/admin/orders",
    },
    {
        icon: <InventoryIcon />,
        label: "Products",
        ref: "/admin/products",
    },
    {
        icon: <AddBoxIcon />,
        label: "Add Product",
        ref: "/admin/new_product",
    },
    {
        icon: <GroupIcon />,
        label: "Users",
        ref: "/admin/users",
    },
    {
        icon: <ReviewsIcon />,
        label: "Reviews",
        ref: "/admin/reviews",
    },
    {
        icon: <AccountBoxIcon />,
        label: "My Profile",
        ref: "/account",
    },
    {
        icon: <LogoutIcon />,
        label: "Logout",
    },
];

const Sidebar = ({ activeTab, setToggleSidebar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { user } = useSelector((state) => state.user);

    const handleLogout = () => {
        dispatch(logoutUser());
        enqueueSnackbar("Logout Successfully", { variant: "success" });
        navigate("/login");
    }

    return (
        <div className="sidebar-container">
            <aside className="sidebar fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col overflow-x-hidden overflow-y-auto border-r bg-gray-800 pb-14 text-white shadow-2xl md:z-10">
                <div className="flex items-center gap-3 bg-gray-700 p-2 rounded-lg shadow-lg my-4 mx-3.5">
                    <Avatar
                        alt="Avatar"
                        src={user.avatar.url}
                    />
                    <div className="flex flex-col gap-0">
                        <span className="font-medium text-lg">{user.name}</span>
                        <span className="text-gray-300 text-sm">{user.email}</span>
                    </div>
                    <button onClick={() => setToggleSidebar?.(false)} className="md:hidden bg-gray-800 ml-auto rounded-full w-10 h-10 flex items-center justify-center" aria-label="Close sidebar">
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex flex-col w-full gap-0 my-8">
                    {navMenu.map((item, index) => {
                        const { icon, label, ref } = item;
                        return (
                            <div key={ref || label}>
                                {label === "Logout" ? (
                                    <button type="button" onClick={handleLogout} className="hover:bg-gray-700 flex gap-3 items-center py-3 px-4 font-medium">
                                        <span>{icon}</span>
                                        <span>{label}</span>
                                    </button>
                                ) : (
                                    <Link
                                        to={ref}
                                        onClick={() => setToggleSidebar?.(false)}
                                        className={`${activeTab === index ? "bg-gray-700" : "hover:bg-gray-700"} flex gap-3 items-center py-3 px-4 font-medium`}
                                    >
                                        <span>{icon}</span>
                                        <span>{label}</span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
