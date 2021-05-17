import styled from 'styled-components'
import ContainerProps from './types'

export const StyledContainer = styled.div<ContainerProps>`
  width: ${({ w = '0' }) => w};
  height: ${({ h = '0' }) => h};
  background: ${({ bg = 'none' }) => bg};
  border-radius: ${({ radius = '0px' }) => radius};
`
