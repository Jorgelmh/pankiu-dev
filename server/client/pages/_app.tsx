import { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => {
  // Aditional props
  // Aditional layout
  // Handle errors - componentDidCatch
  return <Component {...pageProps} />
}

export default MyApp
