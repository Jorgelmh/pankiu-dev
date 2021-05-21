import styled from 'styled-components'
import Container from 'components/atoms/container'

export const ButtonDisplay = styled(Container)`
  display: flex;
  align-item: flex-start;
  justify-content: flex-start;
  width: 0px;
  height: 0px;
`
export const HeaderProfile = styled(Container)`
  width: 100%;
  height: 225px;
  background: #6e6be8;
  border-radius: 0 0 40px 40px;
`
export const ImgContainer = styled(Container)`
  display: block;
  margin: 5px auto;
  background: #f6f2f2;
  border: 6px solid #6973aa;
  box-sizing: border-box;
  border-radius: 3px 100px 100px 100px;
  width: 80px;
  height: 80px;
`
export const Form = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #c4c4c4;
  box-sizing: content-box;
  border-radius: 0px 30px 30px 30px;
  width: 400px;
`
export const Styledinput = styled.input`
  background: #f8f7fe;
  border: 1px solid;
  border-radius: 5px;
`
export const FormContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
`
export const ButtonContainer = styled(Container)`
  display: flex;
  margin: 0 auto;
  justify-content: center;
`
export const EditProfileContainer = styled(Container)`
  width: 200px;
  height: 30px;
  font-family: 'poppins';
  margin: 10px 0px 0px 0px;
`
export const EditProfile = styled(Container)`
  display: flex;
  margin: 50px 0px 50px 0px;
  justify-content: center;
`
