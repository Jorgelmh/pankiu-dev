import styled from 'styled-components'
import StyledHeader from './types'

export const StyledHeader = styled.div<StyledHeader>`
  width: ${({ w = '0' }) => w};
  height: ${({ h = '0' }) => h};
`
