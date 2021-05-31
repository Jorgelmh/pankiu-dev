import styled from "styled-components";
import Container from "components/atoms/container";
import { Button } from "@progress/kendo-react-buttons";

export const StyledHomeMain = styled.main`
  display: grid;
`;
export const StyledContainerButton = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;
export const ContainerBottom = styled(Container)<any>`
display:flex;
justify-content: center;
flex-direction:column;
align-items:center;
margin ${({ margin = "0" }) => margin}; 
`;
export const StyledButton = styled(Button)`
  display: flex;
  width: 100%;
  align-items: flex-end;
  margin-top: 30px;
  margin-bottom: 30px;
  width:30%;
`;
