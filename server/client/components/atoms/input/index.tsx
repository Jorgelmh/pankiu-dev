import { StyledContainer } from './styles'

const Container: React.FC = ({ children }) => {
  return (
    <>
      <StyledContainer>{children}</StyledContainer>
    </>
  )
}

export default Container
