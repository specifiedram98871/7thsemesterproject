import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const footerLinks = [
  {
    title: "about",
    links: [
      { name: "Contactus", redirect: "/contactus" },
      { name: "About Us", redirect: "/aboutus" },
      { name: "Careers", redirect: "/careers" },
      { name: "Press", redirect: "/press" },
      { name: "ShopEase Wholesale", redirect: "/shopeasewholesale" },
    ]
  },
  {
    title: "help",
    links: [
      { name: "FAQ", redirect: "/faq" },
    ]
  },
  {
    title: "policy",
    links: [
      { name: "Return Policy", redirect: "/returnpolicy" },
      { name: "Security", redirect: "/security" },
      { name: "Privacy", redirect: "/privacy" },
      { name: "Sitemap", redirect: "/sitemap" },
      { name: "EPR Compliance", redirect: "/epr" },
    ]
  },
];

const Footer = () => {
  const location = useLocation();
  const [adminRoute, setAdminRoute] = useState(false);

  useEffect(() => {
    setAdminRoute(location.pathname.split("/", 2).includes("admin"));
  }, [location]);

  return (
    <>
      {!adminRoute && (
        <>
          <footer className="mt-20 w-full border-t border-white/60 bg-[#1f130f] text-white shadow-[0_-18px_55px_rgba(18,10,6,0.2)]">
            <div className="site-shell py-12">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-200/90">Pizza House</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Crafted for slow dinners, fast cravings, and warm nights.</h2>
                  <p className="mt-4 max-w-md text-sm leading-7 text-white/70">A calmer, cleaner storefront designed to keep the food, flavor, and ordering journey front and center.</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-3 lg:col-span-5">
                  {footerLinks.map((el, i) => (
                    <div className="flex flex-col gap-3" key={i}>
                      <h2 className="text-xs uppercase tracking-[0.28em] text-orange-200/90">{el.title}</h2>
                      {el.links.map((item, j) => (
                        item.redirect.startsWith("http") ? (
                          <a href={item.redirect} target="_blank" rel="noreferrer" className="text-sm text-white/70 transition hover:text-white" key={j}>{item.name}</a>
                        ) : (
                          <Link to={item.redirect} className="text-sm text-white/70 transition hover:text-white" key={j}>{item.name}</Link>
                        )
                      ))}
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-3">
                  <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
                    <h2 className="text-xs uppercase tracking-[0.28em] text-orange-200/90">Made by</h2>
                    <p className="mt-4 leading-7 text-white/75">Ram Timalsina<br />
                      Sanjay Tripathi<br />
                      Sushant Pant<br />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/20 px-4 py-4 text-center text-sm text-white/70">
              <span>&copy; 2020-{new Date().getFullYear()} Pizza House</span>
            </div>
          </footer>
        </>
      )}
    </>
  );
};

export default Footer;
