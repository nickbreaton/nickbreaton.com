module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
    'gatsby-plugin-netlify',
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
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
