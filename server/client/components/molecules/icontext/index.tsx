import { StyledContainer } from './styles'
import Text from '@atoms/text'

const IconText: React.FC = (props) => {
  return (
    <>
      <StyledContainer>
        <img
          width="50px"
          src="https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg"
          alt=""
        />
        <Text>{props.children}</Text>
      </StyledContainer>
    </>
  )
}

export default IconText
