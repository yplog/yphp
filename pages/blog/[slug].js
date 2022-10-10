import Image from "next/image";
import Link from "next/link";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SyntaxHighlighter from "react-syntax-highlighter";
import styles from "../../styles/Blog.module.css";

const components = { SyntaxHighlighter, Image };

const BlogPage = ({ frontMatter: { title, date }, mdxSource }) => {
  return (
    <div>
      <div className={styles.blog}>
        <hr />
        <h2>{title}</h2>
        <i>
          <p>{date}</p>
        </i>
        <MDXRemote {...mdxSource} components={components} />
        <hr />
      </div>

      <div style={{ marginTop: 10, marginBottom: 20, textAlign: "center" }}>
        <Link href="/blog">
          <a>{"<< All Posts"}</a>
        </Link>
      </div>
    </div>
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
