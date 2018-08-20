import React from 'react'
import Helmet from 'react-helmet'
import favicon from '../assets/favicon.png';

const Layout = ({ children }) => (
  <>
    <Helmet>
      <html lang='en-us' />
      <title>Nick Breaton</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content='Software Engineer' />
      <link rel='icon' type='image/png' href={favicon} />
      <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' />
    </Helmet>
    {children}
  </>
)

export default Layout
