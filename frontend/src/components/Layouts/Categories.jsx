import bakery from '../../assets/images/Categories/bakery.png';
import candy from '../../assets/images/Categories/candy.png';
import drinks from '../../assets/images/Categories/drinks.png';
import essentials from '../../assets/images/Categories/essentials.png';
import meat from '../../assets/images/Categories/meat.png';
import milk from '../../assets/images/Categories/milk.png';
import snacks from '../../assets/images/Categories/snacks.png';
import vegetables from '../../assets/images/Categories/vegetables.png';
import { Link } from 'react-router-dom';

const catNav = [
    {
        name: "Bakery",
        icon: bakery,
    },
    {
        name: "Packaged Foods",
        icon: candy,
    },
    {
        name: "Snacks and Beverages",
        icon: drinks,
    },
    {
        name: "Household Essentials",
        icon: essentials,
    },
    {
        name: "Frozen Foods",
        icon: meat,
    },
    {
        name: "Dairy and Eggs",
        icon: milk,
    },
    {
        name: "International Foods",
        icon: snacks,
    },
    {
        name: "Fresh Produce",
        icon: vegetables,
    },

]

const Categories = () => {
    return (
        <section className="hidden sm:block pt-6">
            <div className="site-shell">
                <div className="warm-card overflow-hidden px-4 py-4 sm:px-6">
                    <div className="my-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-[#c2410c]">Explore the menu</p>
                            <h2 className="text-2xl font-semibold text-[#22170f]">Crowd favorites, baked fresh</h2>
                        </div>
                        <Link to="/products" className="rounded-full border border-[#edd9c7] bg-[#fff5eb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b5a2b] transition hover:bg-[#f7e8d8]">
                            See all
                        </Link>
                    </div>

                    <div className="grid grid-cols-8 gap-3">
                        {catNav.map((item, i) => (
                            <Link to={`/products?category=${item.name}`} className="group flex flex-col items-center gap-2 rounded-[22px] border border-[#f1dfcf] bg-white/80 px-3 py-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#c2410c]/30 hover:shadow-lg" key={i}>
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff1e5] to-[#ffe0c4] p-2 ring-1 ring-white/80">
                                    <img draggable="false" className="h-full w-full object-contain" src={item.icon} alt={item.name} />
                                </div>
                                <span className="text-sm font-medium text-[#3a2418] transition group-hover:text-[#c2410c]">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;
