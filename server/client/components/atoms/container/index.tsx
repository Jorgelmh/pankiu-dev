import { StyledContainer } from './styles'
import ContainerProps from './types'

const Container: React.FC<ContainerProps> = (props) => {
  return (
    <>
      <StyledContainer {...props}>{props.children}</StyledContainer>
    </>
  )
}

export default Container
