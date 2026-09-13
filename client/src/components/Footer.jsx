import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Linkedin } from "./SocialIcons";

const columns = [
  {
    title: "COMPANY",
    links: ["About", "Features", "Works", "Career"],
  },
  {
    title: "HELP",
    links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
  },
  {
    title: "FAQ",
    links: ["Account", "Orders", "Shipping", "Returns"],
  },
  {
    title: "RESOURCES",
    links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="text-xl font-extrabold tracking-tight">
              SHOP<span className="font-light">CO</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-gray-500">
              Premium fashion essentials crafted for individuality and everyday style.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-black hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-wider text-gray-900">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-gray-500 transition hover:text-black">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © 2026 ShopCo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
