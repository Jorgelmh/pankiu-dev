import styled from 'styled-components'
import Container from '@atoms/container'

export const StyledHomeMain = styled.main`
  display: grid;
`
export const StyledContainerButton = styled(Container)`
  display: flex;
  justify-content: center;
  margin: 30px 0px 0px 0px;
`
export const ContainerBottom = styled(Container)<any>`
display:flex;
justify-content: center;
flex-direction:column;
margin ${({ margin = '0' }) => margin}; 
`
