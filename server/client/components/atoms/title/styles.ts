import styled from 'styled-components'
import TitleProps from './types'

export const StyledTitle = styled.h1<TitleProps>`
  font-size: ${({ size = '12px' }) => size};
  color: ${({ color = '#000000' }) => color};
`
