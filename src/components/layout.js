import React from 'react'
import Helmet from 'react-helmet'

// import { StaticQuery, graphql } from "gatsby"

// const TitleQuery = ({ children }) => (
//   <StaticQuery
//     query={graphql`
//       query SiteTitleQuery {
//         site {
//           siteMetadata {
//             title
//           }
//         }
//       }
//     `}
//     render={children}
//   />
// )

const Layout = ({ children }) => (
  <>
    <Helmet>
      <title>Nick Breaton</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content='Software Engineer' />
      <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Open+Sans' />
      <link rel='icon' type='image/png' href='favicon.png' />
    </Helmet>
    {children}
  </>
)

export default Layout
