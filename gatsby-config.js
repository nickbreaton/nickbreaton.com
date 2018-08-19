module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-react-helmet'
    },
    {
      resolve: 'gatsby-plugin-styled-components'
    },
    {
      resolve: 'gatsby-plugin-netlify'
    },
    {
      resolve: 'gatsby-plugin-offline'
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography'
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Nick Breaton',
        short_name: 'Nick',
        start_url: '/',
        background_color: '#FFF',
        theme_color: '#FFF',
        display: 'minimal-ui',
        icon: 'src/assets/favicon.png',
      },
    },
  ]
}
