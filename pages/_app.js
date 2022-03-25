import Navbar from '../components/Navbar'
import '../styles/app.css'
import { UserProvider } from '@auth0/nextjs-auth0'
import { MantineProvider } from '@mantine/core'

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
      }}
    >
      <UserProvider>
        <div className="bg-blue-600 w-full p-10 min-h-screen">
          <Navbar />
          <div className="max-w-2xl mx-auto">
            <Component {...pageProps} />
          </div>
        </div>
      </UserProvider>
    </MantineProvider>
  )
}

export default MyApp
