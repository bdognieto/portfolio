console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio/";   // change this if your repo name is different

const pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/", title: "CV" },
  { url: "contact/", title: "Contact" },
  { url: "https://github.com/bdognieto", title: "GitHub" }
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // fix internal links for local dev vs GitHub Pages
  url = !url.startsWith("http") ? BASE_PATH + url : url;

  // create link
  nav.insertAdjacentHTML("beforeend", `<a href="${url}">${title}</a>`);
}

// highlight current page + open external links in new tab
let navLinks = $$("nav a");

for (let a of navLinks) {
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  if (a.host !== location.host) {
    a.target = "_blank";
    a.rel = "noreferrer noopener";
  }
}