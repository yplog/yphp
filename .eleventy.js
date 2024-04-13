module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets/css/bundle.css");
  
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes"
    },
    passthroughFileCopy: true,
  };
};

