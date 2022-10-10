import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SyntaxHighlighter from "react-syntax-highlighter";
import Image from "next/image";

const components = { SyntaxHighlighter, Image };

const BlogPage = ({ frontMatter: { title, date, tags }, mdxSource }) => {
  return (
    <>
      <hr />
      <div style={{ margin: 30 }}>
        <h2 style={{ textAlign: "center" }}>{title}</h2>
        <i style={{ textAlign: "right" }}>
          <p>{date}</p>
        </i>
        <MDXRemote {...mdxSource} components={components} tags={tags} />
      </div>
    </>
  );
};

const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join("data/blog"));

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".mdx", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMeta = fs.readFileSync(
    path.join("data/blog", slug + ".mdx"),
    "utf-8"
  );

  const { data: frontMatter, content } = matter(markdownWithMeta);
  const mdxSource = await serialize(content);

  return {
    props: {
      frontMatter,
      slug,
      mdxSource,
    },
  };
};

export { getStaticProps, getStaticPaths };
export default BlogPage;
