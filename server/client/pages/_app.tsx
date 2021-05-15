import Layout from '@templates/layout'
import GlobalStyles from '@styles/global'
import { ThemeProvider } from 'styled-components'

import Theme from '@styles/theme'
import { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <GlobalStyles />
      <ThemeProvider theme={Theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Layout>
  )
}

export default MyApp
