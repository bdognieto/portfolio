import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const title = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

let selectedIndex = -1;
let query = '';

title.textContent = `Projects (${projects.length})`;
renderProjects(projects, projectsContainer, 'h2');

function getFilteredProjects() {
  let filteredProjects = projects.filter(project => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  if (selectedIndex !== -1) {
    let visibleYears = d3.rollups(
      filteredProjects,
      v => v.length,
      d => d.year
    );

    let selectedYear = visibleYears[selectedIndex]?.[0];

    filteredProjects = filteredProjects.filter(
      project => project.year == selectedYear
    );
  }

  return filteredProjects;
}

function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  d3.select('#projects-pie-plot').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  let sliceGenerator = d3.pie().value(d => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map(d => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  let svg = d3.select('#projects-pie-plot');

  arcs.forEach((arc, idx) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .attr('class', idx === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        let filteredProjects = getFilteredProjects();

        renderProjects(filteredProjects, projectsContainer, 'h2');
        renderPieChart(projectsGiven);
      });
  });

  let legend = d3.select('.legend');

  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', idx === selectedIndex ? 'selected' : '')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  selectedIndex = -1;

  let filteredProjects = getFilteredProjects();

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});