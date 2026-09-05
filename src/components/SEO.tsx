import { useSiteStore } from '@/stores/data-site';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  canonical?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image,
  canonical,
}: SEOProps) {
  const siteData = useSiteStore((state) => state.siteData);

  const siteUrl = 'https://dukung-atac.com';

  const fullTitle = `${siteData.app_name || 'Dukung ATAC'} | ${title}`;

  const metaImage =
    image || `${siteUrl}/og-image.webp`;

  const favicon =
    siteData.app_logo || `${siteUrl}/favicon.ico`;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta
        name="description"
        content={description}
      />

      {keywords && (
        <meta
          name="keywords"
          content={keywords}
        />
      )}

      {canonical && (
        <link
          rel="canonical"
          href={`${siteUrl}${canonical}`}
        />
      )}

      {/* Favicon */}
      <link
        key="favicon"
        rel="icon"
        type="image/webp"
        href={favicon}
      />

      <link
        key="apple-touch-icon"
        rel="apple-touch-icon"
        href={favicon}
      />

      {/* Open Graph */}
      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content={fullTitle}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:image"
        content={metaImage}
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={fullTitle}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={metaImage}
      />
    </Helmet>
  );
}