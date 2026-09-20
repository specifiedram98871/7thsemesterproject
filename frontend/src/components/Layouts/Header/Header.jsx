import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Searchbar from "./Searchbar";
import logo from "../../../assets/images/logo.ico";
import PrimaryDropDownMenu from "./PrimaryDropDownMenu";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);

  return (
    <header className="sticky h-24 top-0 z-20 w-full border-b border-white/20 bg-[#1f130f]/88 backdrop-blur-xl shadow-[0_14px_40px_rgba(31,19,15,0.25)]">
      <div className="site-shell flex items-center justify-between gap-3 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link className="pb-1  bg-green-500 items-center justify-center rounded-2xl " to="/">
            <img
              draggable="false"
              className="h-full w-full object-contain"
              src={logo}
              alt="ShopEase Logo"
            />
          </Link>
          
          <div className="flex-1 min-w-0 max-w-2xl">
            <Searchbar />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {isAuthenticated === false ? (
            <Link
              to="/login"
              className="pill-button-primary text-black-500 whitespace-nowrap border-white/20 text-xs sm:text-sm"
            >
              Login
            </Link>
          ) : (
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-white/15  px-4 py-2 text-green-400 text-sm font-medium text-green-500 transition hover:bg-green-500 hover:text-white"
              onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
            >
              <span className="hidden my-auto sm:inline mx-auto">{user && user.name && user.name.split(" ", 1)}</span>
              <span>
                {togglePrimaryDropDown ? (
                  <ExpandLessIcon sx={{ fontSize: "16px" }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: "16px" }} />
                )}
              </span>
            </button>
          )}
          {togglePrimaryDropDown && (
            <PrimaryDropDownMenu
              setTogglePrimaryDropDown={setTogglePrimaryDropDown}
              user={user}
            />
          )}
          <Link
            to="/cart"
            className="pill-button-primary-green hover:bg-green-500 relative gap-2 whitespace-nowrap"
          >
            <span>
              <ShoppingCartIcon />
            </span>
            <span className="hidden sm:inline">Cart</span>
            {cartItems.length > 0 && (
              <div className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border border-white bg-amber-400 px-1 text-xs font-bold text-[#22170f]">
                {cartItems.length}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
