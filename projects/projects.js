import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const title = document.querySelector('.projects-title');

renderProjects(projects, projectsContainer, 'h2');

const count = projects.length;
title.textContent = `Projects (${count})`;

function renderPieChart(projectsGiven) {

  // roll up data
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // CLEAR OLD PIE CHART
  d3.select('#projects-pie-plot').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  // generators
  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  let sliceGenerator = d3.pie().value(d => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map(d => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // draw pie
  arcs.forEach((arc, idx) => {
    d3.select('#projects-pie-plot')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx));
  });

  // legend
  let legend = d3.select('.legend');

  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}
renderPieChart(projects);
let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();

  let filteredProjects = projects.filter(project => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  // update project list
  renderProjects(filteredProjects, projectsContainer, 'h2');

  // update pie chart
  renderPieChart(filteredProjects);
});