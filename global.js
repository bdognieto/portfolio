console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
// get all nav links
let navLinks = $$("nav a");

// find the link that matches the current page
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

// add 'current' class if found
if (currentLink) {
  currentLink.classList.add("current");
}