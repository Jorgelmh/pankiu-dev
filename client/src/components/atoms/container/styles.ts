import styled from "styled-components";
import ContainerProps from "./types";

export const StyledContainer = styled.div<ContainerProps>`
  width: ${({ w = "auto" }) => w};
  height: ${({ h = "auto" }) => h};
  margin: ${({ m = "0" }) => m};
  padding: ${({ p = "0" }) => p};
  background: ${({ bg = "none" }) => bg};
  border-radius: ${({ radius = "0px" }) => radius};
  display: ${({ display = "" }) => display};
  flex-direction: ${({ direction = "" }) => direction};
  justify-content: ${({ justify = "" }) => justify};
  align-items: ${({ align = "" }) => align};
`;
