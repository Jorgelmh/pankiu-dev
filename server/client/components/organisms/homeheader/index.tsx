import Header from '@atoms/header'
import Title from '@atoms/title'
import Text from '@atoms/text'
import Motivation from '@molecules/motivation'

const HomeHeader: React.FC = () => {
  return (
    <>
      <Header>
        <Title>Hi User,</Title>
        <Text>Need some help today?</Text>
        <Motivation />
      </Header>
    </>
  )
}

export default HomeHeader
