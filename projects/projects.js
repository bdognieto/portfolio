import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const title = document.querySelector('.projects-title');

renderProjects(projects, projectsContainer, 'h2');

const count = projects.length;
title.textContent = `Projects (${count})`;