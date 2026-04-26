import { fetchJSON, renderProjects } from './global.js';

// get ALL projects
const projects = await fetchJSON('./lib/projects.json');

// get first 3
const latestProjects = projects.slice(0, 3);

// find container on homepage
const projectsContainer = document.querySelector('.projects');

// render them
renderProjects(latestProjects, projectsContainer, 'h2');