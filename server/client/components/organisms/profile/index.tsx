import Title from '@components/atoms/title'
import { Button } from '@progress/kendo-react-buttons'
import { ButtonDisplay, HeaderProfile } from './styles'

const Profile: React.FC = () => {
  return (
    <>
      <HeaderProfile>
        <ButtonDisplay>
          <Button icon="undo" look="flat" />
        </ButtonDisplay>
        <Title
          color="#D0CFF4"
          size="24"
          display="flex"
          justifyContent="center"
          margin="40px 0px 0px 0px"
        >
          Your Profile
        </Title>
        <img src="img\user 1.svg"></img>
      </HeaderProfile>
    </>
  )
}

export default Profile
