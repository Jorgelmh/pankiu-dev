import styled from 'styled-components'
import Container from './types'

export const StyledContainer = styled.div<Container>`
  width: ${({ w = '0' }) => w};
  height: ${({ h = '0' }) => h};
`
