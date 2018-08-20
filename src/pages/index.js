import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import me from '../assets/me.jpeg';

const Content = styled.div`
  font-family: 'Open Sans', 'sans';
  text-align: center;
  margin: auto;
  max-width: 25rem;
  width: 90%;
`;

const ProfileImage = styled.img`
  width: 16rem;
  border-radius: 100%;
`;

const ExternalLink = styled.a`
  color: #16a085;
  text-decoration: none;
  &::after {
    content: ' • ';
    color: black;
  }
  &:last-child::after {
    content: none;
  }
`;

const InteralLink = ExternalLink.withComponent(Link);

const IndexPage = () => (
  <Layout>
    <Content>
      <h1>Hi, I'm Nick Breaton</h1>
      <ProfileImage
        alt='Nick Breaton'
        src={me}
      />
      <h2>Software Engineer</h2>
      <div>
        {/* <InteralLink to='blog/'>Blog</InteralLink> */}
        <ExternalLink href='https://github.com/nickbreaton'>GitHub</ExternalLink>
        <ExternalLink href='https://www.linkedin.com/in/nickbreaton'>LinkedIn</ExternalLink>
        <ExternalLink href='mailto:nick@breaton.com'>Email</ExternalLink>
      </div>
    </Content>
  </Layout>
);

export default IndexPage;
