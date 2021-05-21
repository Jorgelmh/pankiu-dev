import Title from 'components/atoms/title'
import { Button } from '@progress/kendo-react-buttons'
import {
  ButtonDisplay,
  Form,
  HeaderProfile,
  ImgContainer,
  Styledinput,
  FormContainer,
  ButtonContainer,
  EditProfileContainer,
  EditProfile,
} from './styles'

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
        <ImgContainer>
          <img
            src="img\user 1.svg"
            alt=""
            style={{
              display: 'flex',
              margin: '5px auto',
              height: '60px',
              width: '60px',
            }}
          />
        </ImgContainer>
        <ButtonContainer>
          <Button>Change Profile Picture</Button>
        </ButtonContainer>
      </HeaderProfile>
      <br />
      <FormContainer>
        <Form>
          <Title margin="5px auto" size="14px">
            Your name
          </Title>
          <Styledinput />
          <Title margin="5px auto" size="14px">
            Username
          </Title>
          <Styledinput />
          <Title margin="5px auto" size="14px">
            Email
          </Title>
          <Styledinput />
          <Title margin="5px auto" size="14px">
            Password
          </Title>
          <Styledinput />
          <br />
        </Form>
      </FormContainer>
      <EditProfile>
        <Button>
          <EditProfileContainer>Edit Profile</EditProfileContainer>
        </Button>
      </EditProfile>
    </>
  )
}

export default Profile
