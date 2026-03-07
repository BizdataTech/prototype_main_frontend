import { HeaderBottom } from "./HeaderBottom";
import HeaderMiddle from "./HeaderMiddle";
import HeaderTop from "./HeaderTop";

const Header = () => {
  return (
    <header
      className="fixed left-0 top-0 right-0 z-100"
      style={{ backgroundColor: "white" }}
    >
      <HeaderTop />
      <HeaderMiddle />
      <HeaderBottom />
    </header>
  );
};
export default Header;
