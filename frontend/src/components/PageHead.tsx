import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageHeadProps {
  title: string;
  description?: string;
  url?: string;
}

const PageHead: React.FC<PageHeadProps> = ({ 
  title, 
  description = "StadiumMind AI - Autonomous Stadium Intelligence Platform",
  url = "https://stadiummind.vercel.app"
}) => {
  const fullTitle = `${title} | StadiumMind AI`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default PageHead;

