import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
}

/**
 * Sets page-level SEO meta tags dynamically.
 * Should be called once per page component.
 */
export const usePageSEO = ({ title, description, keywords, canonical }: SEOProps) => {
    useEffect(() => {
        document.title = `${title} | Confidential Connect Ltd`;

        const setMeta = (name: string, content: string, property?: boolean) => {
            const attr = property ? 'property' : 'name';
            let el = document.querySelector(`meta[${attr}="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('description', description);
        if (keywords) setMeta('keywords', keywords);
        setMeta('og:title', `${title} | Confidential Connect Ltd`, true);
        setMeta('og:description', description, true);

        if (canonical) {
            let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'canonical';
                document.head.appendChild(link);
            }
            link.href = canonical;
        }
    }, [title, description, keywords, canonical]);
};
