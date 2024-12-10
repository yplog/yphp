import { getCollection } from "astro:content";

export async function getPostsCollection() {
  return await getCollection("posts", ({ data }) => {
    return import.meta.env.PROD ? data.isDraft !== true : true;
  });
}