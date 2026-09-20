import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const categories = [
    "Fresh Produce",
    "Dairy and Eggs",
    "Bakery",
    "Snacks and Beverages",
    "Grocery Staples",
    "Packaged Foods",
    "Frozen Foods",
    "Personal Care",
    "Health and Wellness",
    "Baby Care",
    "Cleaning Supplies",
  
]

const MinCategory = () => {
    const { pathname, search } = useLocation();
    const selectedCategory = new URLSearchParams(search).get('category') || '';
    const categoryStrip = useRef(null);
    const dragState = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
    const suppressClick = useRef(false);

    const hideCategoryBar = pathname === '/account'
        || pathname.startsWith('/orders')
        || pathname.startsWith('/order/');

    if (hideCategoryBar) return null;

    const handlePointerDown = (event) => {
        if (!categoryStrip.current || event.target.closest('a')) return;

        dragState.current = {
            active: true,
            moved: false,
            startX: event.clientX,
            scrollLeft: categoryStrip.current.scrollLeft,
        };
        categoryStrip.current.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        const state = dragState.current;
        if (!state.active || !categoryStrip.current) return;

        const distance = event.clientX - state.startX;
        if (Math.abs(distance) > 4) state.moved = true;
        if (state.moved) categoryStrip.current.scrollLeft = state.scrollLeft - distance;
    };

    const handlePointerUp = (event) => {
        const state = dragState.current;
        if (state.moved) suppressClick.current = true;
        dragState.current.active = false;

        if (categoryStrip.current?.hasPointerCapture(event.pointerId)) {
            categoryStrip.current.releasePointerCapture(event.pointerId);
        }
    };

    const handleCategoryClick = (event) => {
        if (suppressClick.current) {
            event.preventDefault();
            suppressClick.current = false;
        }
    };

    return (
        <section className="hidden pt-3 sm:block">
            <div className="site-shell">
                <div
                    ref={categoryStrip}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className="flex cursor-grab select-none items-center gap-3 overflow-x-auto rounded-full border border-[#edd9c7] bg-white/85 px-3 py-3 shadow-[0_12px_40px_rgba(80,45,18,0.08)] backdrop-blur-sm active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    style={{ touchAction: 'pan-y' }}
                >
                    {/* <span className="rounded-full bg-[#c2410c] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white whitespace-nowrap">Fresh picks</span> */}
                    {categories.map((el, i) => {
                        const isActive = selectedCategory === el;

                        return (
                        <Link onClick={handleCategoryClick} to={`/products?category=${encodeURIComponent(el)}`} key={i} className={`group flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${isActive ? 'border-[#c2410c] bg-[#c2410c] text-white' : 'border-transparent bg-[#fff7ef] text-[#3a2418] hover:border-[#c2410c]/25 hover:bg-[#f7e8d8] hover:text-[#c2410c]'}`}>
                            {el}
                            <span className={`transition ${isActive ? 'text-white' : 'text-[#b88963] group-hover:text-[#c2410c]'}`}><ExpandMoreIcon sx={{ fontSize: "16px" }} /></span>
                        </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default MinCategory;
