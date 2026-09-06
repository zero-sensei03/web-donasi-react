import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
}

const SITE_URL = 'https://donasi.meifadev.my.id';
const SITE_NAME = 'Ayo Berdonasi';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.webp`;

export function SEO({
  title,
  description,
  keywords,
  image,
  canonical,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

  const metaImage = image || DEFAULT_IMAGE;

  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : SITE_URL;

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      {keywords && <meta name="keywords" content={keywords} />}

      <meta
        name="robots"
        content={
          noIndex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />

      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />

      <meta property="og:site_name" content={SITE_NAME} />

      <meta property="og:locale" content="id_ID" />

      <meta property="og:title" content={fullTitle} />

      <meta property="og:description" content={description} />

      <meta property="og:url" content={canonicalUrl} />

      <meta property="og:image" content={metaImage} />

      <meta property="og:image:secure_url" content={metaImage} />

      <meta property="og:image:type" content="image/webp" />

      <meta property="og:image:width" content="1200" />

      <meta property="og:image:height" content="630" />

      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:title" content={fullTitle} />

      <meta name="twitter:description" content={description} />

      <meta name="twitter:image" content={metaImage} />

      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Helmet>
  );
}
