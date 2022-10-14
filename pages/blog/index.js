import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

const Blog = ({ posts }) => {
  console.log(posts)
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "50vh" }}
    >
      <h1 style={{ textAlign: "center" }}>Blog Posts ✍️</h1>
      <ul style={{ listStyleType: "circle" }}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <li key={index}>
              <Link href={"/blog/" + post.slug} passHref>
                <a>{post.frontMatter.title}</a>
              </Link>
              , <i>{post.frontMatter.date}</i>
            </li>
          ))
        ) : (
          <li>There are no posts yet.</li>
        )}
      </ul>
    </div>
  );
};

export const getStaticProps = async () => {
  const files = fs.readdirSync(path.join("data/blog"));

  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join("data/blog", filename),
      "utf-8"
    );
    const { data: frontMatter } = matter(markdownWithMeta);

    return {
      frontMatter,
      slug: filename.split(".")[0],
    };
  });

  return {
    props: {
      posts,
    },
  };
};

export default Blog;
