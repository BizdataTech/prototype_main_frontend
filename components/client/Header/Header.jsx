import { HeaderBottom } from "./HeaderBottom";
import HeaderMiddle from "./HeaderMiddle";
import HeaderTop from "./HeaderTop";

const Header = () => {
  return (
    <header
      className="fixed left-0 top-0 right-0 z-100 bg-white"
      style={{
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.07), 0 10px 30px -5px rgba(0,0,0,0.08), 0 1px 3px 0 rgba(0,0,0,0.06)",
      }}
    >
      <HeaderTop />
      <HeaderMiddle />
      <HeaderBottom />
    </header>
  );
};
export default Header;
