import { StyledHeader } from "./styles";
import Headerprops from "./types";

const Header: React.FC<Headerprops> = (props) => {
  return (
    <>
      <StyledHeader>{props.children}</StyledHeader>
    </>
  );
};

export default Header;
