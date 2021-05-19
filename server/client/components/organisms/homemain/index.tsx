import { useState } from 'react'

import Title from '@atoms/title'
import Text from '@atoms/text'
import {
  Button,
  DropDownButton,
  ButtonGroup,
} from '@progress/kendo-react-buttons'

import { StyledHomeMain } from './styles'

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
        <Title>Choose your Option</Title>
        <Text>Who do you want to talk with?</Text>
        <DropDownButton text="Language" items={lang} icon="folder" />

        <div>
          <h4>Order meal:</h4>
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
        </div>
        <Button>Search</Button>
      </StyledHomeMain>
    </>
  )
}

export default HomeMain
