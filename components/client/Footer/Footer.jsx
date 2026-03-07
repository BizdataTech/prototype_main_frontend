import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div
        className="py-16 "
        style={{ backgroundColor: "#b00015", color: "white" }}
      ></div>
      <div
        className="py-16"
        style={{ backgroundColor: "black", color: "white" }}
      >
        <div className="w-[90%] mx-auto flex justify-between">
          <div>
            <h3 className="font-medium text-[1.7rem] mb-4">About</h3>
            <ul className="space-y-1 text-[1.5rem]">
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/career" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:underline">
                  Store
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-[1.7rem] mb-4">
              Registered Office Address
            </h3>
            <ul>
              <li className="text-lg leading-relaxed text-[1.5rem]">
                Prototype Ashtamudi Towers TechnoPark Kollam 691501{" "}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
