import rss from '@astrojs/rss';

export function GET(context) {
  return rss({
    title: 'yp’s Blog',
    description: 'Software development and open-source content by yp.',
    site: context.site,
    items: [],
    customData: `<language>en-us</language>`,
  });
}