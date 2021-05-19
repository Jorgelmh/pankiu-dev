import styled from 'styled-components'
import TitleProps from './types'

export const StyledTitle = styled.h1<TitleProps>`
  font-size: ${({ size = '30px' }) => size};
  color: ${({ color = '#000000' }) => color};
  font-family ${({ fontFamily = 'Poppins' }) => fontFamily};
  margin ${({ margin = '0' }) => margin}; 
  
`
