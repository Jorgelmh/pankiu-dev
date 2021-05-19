import TopBar from '@components/organisms/topbar'
import HomeHeader from '@components/organisms/homeheader'
import HomeMain from '@components/organisms/homemain'
import Menu from '@components/organisms/menu'

const Home: React.FC = () => {
  return (
    <>
      <TopBar />
      <HomeHeader />
      <HomeMain />
      <Menu />
    </>
  )
}

export default Home
