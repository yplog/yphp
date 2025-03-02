import { getCollection } from "astro:content";

export async function getAllPosts() {
  return await getCollection("posts");
}

export async function getPublishedPosts() {
  return await getCollection("posts", ({ data }) => !data.draft);
}

export async function getDraftPosts() {
  return await getCollection("posts", ({ data }) => data.draft);
}

export async function getPostsCollection() {
  if (import.meta.env.PROD) {
    return await getPublishedPosts();
  }

  return await getAllPosts();
}
