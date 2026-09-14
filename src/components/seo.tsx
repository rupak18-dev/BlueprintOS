import { Helmet } from "react-helmet-async";

export function Seo({ title, description }: { title: string; description?: string }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      {description ? <meta name="description" content={description} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
    </Helmet>
  );
}
