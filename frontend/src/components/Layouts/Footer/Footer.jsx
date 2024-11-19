import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import StarsIcon from '@mui/icons-material/Stars';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HelpIcon from '@mui/icons-material/Help';
import paymentMethods from '../../../assets/images/payment-methods.svg';

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
  {
    title: "social",
    links: [
      { name: "Facebook", redirect: "https://www.facebook.com/ShopEase" },
      { name: "Twitter", redirect: "https://twitter.com/ShopEase" },
      { name: "YouTube", redirect: "https://www.youtube.com/ShopEase" },
    ]
  }
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
          <footer className="mt-20 w-full py-1 sm:py-4 px-4 sm:px-12 bg-primary-darkBlue text-white text-xs border-b border-gray-600 flex flex-col sm:flex-row overflow-hidden">
            <div className="w-full sm:w-7/12 flex flex-col sm:flex-row">
              {footerLinks.map((el, i) => (
                <div className="w-full sm:w-1/5 flex flex-col gap-2 my-3 sm:my-6 ml-5" key={i}>
                  <h2 className="text-primary-green mb-2 uppercase">{el.title}</h2>
                  {el.links.map((item, j) => (
                    item.redirect.startsWith("http") ? (
                      <a href={item.redirect} target="_blank" rel="noreferrer" className="hover:underline" key={j}>{item.name}</a>
                    ) : (
                      <Link to={item.redirect} className="hover:underline" key={j}>{item.name}</Link>
                    )
                  ))}
                </div>
              ))}
            </div>

            <div className="border-gray-600 h-36 w-1 border-l mr-5 mt-6 hidden sm:block"></div>
            <div className="w-full sm:w-5/12 my-6 mx-5 sm:mx-0 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
              <div className="w-full sm:w-1/2">
                <h2 className="text-primary-green">Mail Us:</h2>
                <p className="mt-2 leading-5">ShopEase Private Limited,<br />
                  Baneshwor, Kathmandu &<br />
                  Nepal,<br />
                </p>
              </div>

              <div className="w-full sm:w-1/2">
                <h2 className="text-primary-green">Registered Office Address:</h2>
                <p className="mt-2 leading-5">ShopEase Private Limited,<br />
                  Baneshwor, Kathmandu &<br />
                  Nepal,<br />
                  Telephone: <a className="text-primary-blue" href="tel:01410671">01-410671</a>
                </p>
              </div>
            </div>
          </footer>

          <div className="px-16 py-6 w-full bg-primary-darkBlue hidden sm:flex justify-center items-center text-sm text-white text-center">
            <span>&copy; 2020-{new Date().getFullYear()} ShopEase.com</span>
          </div>
        </>
      )}
    </>
  );
};

export default Footer;
