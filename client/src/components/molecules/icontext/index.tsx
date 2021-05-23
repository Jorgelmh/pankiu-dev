import { StyledContainer } from "./styles";
import Text from "components/atoms/text";
import IconTextProps from './types'

const IconText: React.FC<IconTextProps> = (props) => {
  return (
    <>
      <StyledContainer>
        <img
          width="30px"
          src={props.src}
          alt={props.alt}
        />
        <Text size='14px'>{props.children}</Text>
      </StyledContainer>
    </>
  );
};

export default IconText;
