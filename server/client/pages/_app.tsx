import GlobalStyles from '@styles/global'
import '@styles/theme/hackaton.css'
import { AppProps } from 'next/app'
import Layout from '@templates/layout'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Layout>
        <GlobalStyles />
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp
