/**
 * SEO 组件
 * 用于动态设置页面标题、描述和 meta 信息
 */

import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const SITE_NAME = "Chris's Blog";
const SITE_DESCRIPTION = '一个记录技术思考与生活感悟的个人博客';
const DEFAULT_IMAGE = '/og-image.png';

export function SEO({
  title,
  description = SITE_DESCRIPTION,
  keywords = [],
  image = DEFAULT_IMAGE,
  type = 'website',
}: Props) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullKeywords = ['博客', '技术', '编程', '前端', ...keywords].join(', ');

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
