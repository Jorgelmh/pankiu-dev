import { StyledText } from "./styles";
import Textprops from "./types";

const Text: React.FC<Textprops> = (props) => {
  return (
    <>
      <StyledText {...props}>{props.children}</StyledText>
    </>
  );
};

export default Text;
