export function sortAndFormatPosts(params: Array<any>) {
  return params.sort((a, b) => {
    const dateA = new Date(a.data.pubDate);
    const dateB = new Date(b.data.pubDate);

    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      return 0;
    }

    return dateB.getTime() - dateA.getTime();
  })
    .map((post) => {
      const pubDate = new Date(post.data.pubDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return {
        ...post,
        pubDate,
      };
    });
}