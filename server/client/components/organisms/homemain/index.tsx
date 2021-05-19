import { useState } from 'react'

import Title from '@atoms/title'
import Text from '@atoms/text'
import {
  Button,
  DropDownButton,
  ButtonGroup,
} from '@progress/kendo-react-buttons'

import {
  StyledHomeMain,
  StyledContainerButton,
  ContainerBottom,
} from './styles'
import { Container } from 'next/app'
import ContainerButton from '@atoms/container'

const lang = ['Global', 'English', 'Spanish']

const people = [
  {
    name: 'Random Person',
    icon: '🐒',
  },
  {
    name: 'Counselor',
    icon: '🍣',
  },
]

const HomeMain: React.FC = () => {
  const [person, setPerson] = useState<any>(people[0])

  const handleClick = (name: any) => {
    setPerson(people.find((m: any) => m.name === name))
  }
  return (
    <>
      <StyledHomeMain>
        <Title margin="30px 0px 0px 60px">Choose your Option</Title>
        <Text margin="20px 0px 0px 70px">Who do you want to talk with?</Text>
        <StyledContainerButton>
          <DropDownButton text="Language" items={lang} icon="globe" />
        </StyledContainerButton>

        <ContainerBottom margin="10px 0px 0px 60px">
          <h4>
            <Title margin="0px 0px 10px 100px" size="18">
              Order meal:
            </Title>
          </h4>
          <ButtonGroup>
            {people.map((p, index) => {
              return (
                <div key={index}>
                  <Button
                    togglable={true}
                    selected={person.name === p.name}
                    onClick={handleClick.bind(undefined, p.name)}
                  >
                    <span>{p.icon}</span>
                    {p.name}
                  </Button>
                </div>
              )
            })}
          </ButtonGroup>
        </ContainerBottom>
        <ContainerBottom margin="30px 0px 0px 0px">
          <Button>Search</Button>
        </ContainerBottom>
      </StyledHomeMain>
    </>
  )
}

export default HomeMain
