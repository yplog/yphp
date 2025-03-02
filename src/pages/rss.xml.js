import rss from "@astrojs/rss";
import { getPostsCollection } from "../helpers/collections";

export async function GET(context) {
  const posts = await getPostsCollection();

  return rss({
    title: "yp’s Blog",
    description: "Software development and open-source content by yp.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      tags: post.data.tags,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
