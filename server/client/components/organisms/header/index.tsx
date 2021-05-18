import Container from '@atoms/container'
import Title from '@atoms/title'
import Text from '@atoms/text'

const Header: React.FC = () => {
  return (
    <>
      <Container w="100%" h="225px" bg="#6E6BE8" radius="0 0 40px 40px">
        <Title size="24px" color="#ECECFC">
          Hi User,
        </Title>
        <Text color="#ECECFC">amen</Text>

        <Container bg="#FFFFFF">
          <Text color="#B3B3C7">Motivational Phrase</Text>
        </Container>
      </Container>
    </>
  )
}

export default Header
