import styled from 'styled-components'
import ContainerProps from './types'

export const StyledContainer = styled.div<ContainerProps>`
  width: ${({ w = 'auto' }) => w};
  height: ${({ h = 'auto' }) => h};
  background: ${({ bg = 'none' }) => bg};
  border-radius: ${({ radius = '0px' }) => radius};
`
