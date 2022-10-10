import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Image from "next/image";

const components = { SyntaxHighlighter, Image }


const BlogPage = ({ frontMatter: { title, date, tags }, mdxSource }) => {
  return (
    <div className="mt-4">
      <h1>{title}, {date}</h1>
      <MDXRemote {...mdxSource} components={components} tags={tags} />
    </div>
  )
}

const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join('data/blog'))

  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.mdx', '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMeta = fs.readFileSync(path.join('data/blog',
    slug + '.mdx'), 'utf-8')

  const { data: frontMatter, content } = matter(markdownWithMeta)
  const mdxSource = await serialize(content)

  return {
    props: {
      frontMatter,
      slug,
      mdxSource
    }
  }
}

export { getStaticProps, getStaticPaths }
export default BlogPage