import Header from '@atoms/header'
import Title from '@atoms/title'
import Text from '@atoms/text'
import Motivation from '@molecules/motivation'
import Container from '@atoms/container'

const HomeHeader: React.FC = () => {
  return (
    <>
      <Header>
        <Container
          display="flex"
          align="center"
          justify="center"
          direction="column"
        >
          <Title color="#ECECFC" display="flex">
            Hi User,
          </Title>
          <br />
          <Text color="#ECECFC">Need some help today?</Text>
          <Motivation />
        </Container>
      </Header>
    </>
  )
}

export default HomeHeader
