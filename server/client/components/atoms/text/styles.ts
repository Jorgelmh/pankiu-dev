import styled from 'styled-components'
import Textprops from './types'

export const StyledText = styled.p<Textprops>`
  font-size: ${({ size = '18px' }) => size};
  color: ${({ color = '#000000' }) => color};
`