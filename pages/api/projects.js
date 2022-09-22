export const projectsData = [
  {
    title: "libromarko",
    image: "/images/projects/libromarko.png",
    imageAlt: "libromarko logo",
    content:
      "Freedom for bookmarks. Access your bookmarks from browser, mobile, anywhere.",
    tags: ["react, typescript, postgres, browser extension"],
    links: [
      {
        text: "Web",
        url: "https://libromarko.xyz",
      },
      {
        text: "Docs",
        url: "https://doc.libromarko.xyz",
      },
      {
        text: "Google Play",
        url: "https://play.google.com/store/apps/details?id=xyz.libromarko.app",
      },
      {
        text: "Firefox Add-on",
        url: "https://addons.mozilla.org/en-US/firefox/addon/libromarko/",
      },
      {
        text: "Chrome Extension",
        url: "https://chrome.google.com/webstore/detail/libromarko/jpbjepefiibjgekgaloekkfbjciigcfg",
      },
      { text: "Github", url: "https://github.com/libromarko" },
    ],
  },
  {
    title: "Kutimo",
    image: "/images/projects/kutimo.png",
    imageAlt: "kutimo logo",
    content:
      "A note and color every day. Track your past. See what kind of map you'll end up with.",
    tags: ["flutter"],
    links: [
      {
        text: "Web",
        url: "/kutimo/index.html",
      },
      {
        text: "Snapcraft",
        url: "https://snapcraft.io/kutimo",
      },
      {
        text: "Google Play",
        url: "https://play.google.com/store/apps/details?id=com.kutimo.kutimo",
      },
      { text: "Github", url: "https://github.com/yplog/kutimo" },
    ],
  },
  {
    title: "Picate",
    image: "/images/projects/picate_logo.png",
    imageAlt: "picate logo",
    content: "Lets you search for photos and save them to your favorites.",
    tags: ["kotlin", "firebase", "unsplash"],
    links: [
      {
        text: "Google Play",
        url: "https://play.google.com/store/apps/details?id=site.picate.picate",
      },
      { text: "Github", url: "https://github.com/yplog/picate" },
    ],
  },
  {
    image: "/images/projects/niminy_logo.png",
    imageAlt: "niminy logo",
    title: "niminy",
    content:
      "Users can specify durations that help to plan their working time.",
    tags: ["js", "vscode", "extension"],
    links: [
      {
        text: "Market Place VSCode",
        url: "https://marketplace.visualstudio.com/items?itemName=niminy.niminy",
      },
      { text: "Github", url: "https://github.com/yplog/niminy" },
    ],
  },
  {
    title: "rd-dd",
    content:
      "This script compares the files in the PostgreSQL database with the file assets in the directory. Deletes files that are not in the database.",
    tags: ["perl", "postgresql"],
    links: [{ text: "Github", url: "https://github.com/yplog/rd-dd" }],
  },
  {
    image: "/images/projects/tasko_logo.png",
    imageAlt: "tasko logo",
    title: "Tasko",
    content: "Distributed to-do list application running on BlockStack.",
    tags: ["js", "blockchain", "blockstack"],
    links: [
      { text: "Site", url: "https://cocky-bardeen-6c4387.netlify.app/" },
      { text: "Github", url: "https://github.com/yplog/tasko" },
    ],
  },
  {
    title: "EFF Dice-Generated Passphrases",
    image: "/images/projects/eff_dice_logo.png",
    imageAlt: "eff dice logo",
    content:
      "Create strong passphrases with EFF's new random number generators!",
    tags: ["python", "pickledb"],
    links: [
      { text: "EFF", url: "https://www.eff.org/dice" },
      {
        text: "Github",
        url: "https://github.com/yplog/EFF-Dice-Generated-Passphrases",
      },
    ],
  },
  {
    image: "/images/projects/camelia_logo.png",
    imageAlt: "camelia logo",
    title: "Raku Guide",
    content:
      "This document is intended to give you a quick overview of the Raku programming language.",
    tags: ["documentation", "raku", "perl"],
    links: [
      { text: "raku.guide/tr", url: "https://raku.guide/tr/" },
      { text: "Github", url: "https://github.com/hankache/rakuguide" },
    ],
  },
  {
    image: "/images/projects/urcode_logo.png",
    imageAlt: "urcode logo",
    title: "urcode",
    content:
      "Our goal is to obtain a piece of code that briefly introduce the author.",
    tags: ["js", "nextjs", "pwa"],
    links: [
      { text: "urcode.link", url: "https://urcode.vercel.app/" },
      { text: "Github", url: "https://github.com/3rco/urcode" },
    ],
  },
];

export default function handler(req, res) {
  res.status(200).json({ projects: projectsData });
}
