module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets/css/bundle.css");

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes"
    },
    passthroughFileCopy: true,
  };
};