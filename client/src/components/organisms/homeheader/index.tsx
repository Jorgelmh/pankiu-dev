import Header from "components/atoms/header";
import Title from "components/atoms/title";
import Text from "components/atoms/text";
import Motivation from "components/molecules/motivation";
import Container from "components/atoms/container";

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
  );
};

export default HomeHeader;
