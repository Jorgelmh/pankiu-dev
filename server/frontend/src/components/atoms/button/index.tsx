import { StyledButton } from "./styles";

interface ButtonProps {
  onClick: any;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <>
      <StyledButton>{children}</StyledButton>
    </>
  );
};

export default Button;
