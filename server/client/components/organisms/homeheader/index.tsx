import Header from '@atoms/header'
import Title from '@atoms/title'
import Text from '@atoms/text'
import Motivation from '@molecules/motivation'
import Container from '@atoms/container'

const HomeHeader: React.FC = () => {
  return (
    <>
      <Header>
        <Container p="20px 0px 0px 20px">
          <Title color="#ECECFC">Hi User,</Title>
          <Text color="#ECECFC" margin="15px 0px 0px 0px">
            Need some help today?
          </Text>
        </Container>
        <Motivation />
      </Header>
    </>
  )
}

export default HomeHeader
