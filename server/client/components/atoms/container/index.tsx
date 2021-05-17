import { StyledContainer } from './styles'
import ContainerProps from './types'

const Container: React.FC<ContainerProps> = (props, { children }) => {
  return (
    <>
      <StyledContainer {...props}>{children}</StyledContainer>
    </>
  )
}

export default Container
