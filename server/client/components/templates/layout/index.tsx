import TopBar from '@components/organisms/topbar'
import HomeHeader from '@components/organisms/homeheader'
import HomeMain from '@components/organisms/homemain'
import Menu from '@components/organisms/menu'

const Layout: React.FC = (props) => {
  return (
    <>
      <TopBar />
      {props.children}
      <Menu />
    </>
  )
}

export default Layout
