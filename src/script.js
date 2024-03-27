const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';

fetch(url)
  .then(response => response.json())
  .then(data => {
    const w = 1000;
    const h = 600;

    const svg = d3.select("#treemap")
                  .attr("width", w)
                  .attr("height", h);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const treemap = d3.treemap()
                      .size([w, h])
                      .padding(1);

    const root = d3.hierarchy(data)
                   .sum(d => d.value)
                   .sort((a, b) => b.value - a.value);

    treemap(root);

    const tiles = svg.selectAll("g")
                     .data(root.leaves())
                     .enter()
                     .append("g")
                     .attr("transform", d => `translate(${d.x0},${d.y0})`);

    tiles.append("rect")
         .attr("class", "tile")
         .attr("fill", d => colorScale(d.data.category))
         .attr("data-name", d => d.data.name)
         .attr("data-category", d => d.data.category)
         .attr("data-value", d => d.data.value)
         .attr("width", d => d.x1 - d.x0)
         .attr("height", d => d.y1 - d.y0)
         .on("mouseover", function(d) {
           tooltip.transition()
                  .duration(200)
                  .style("opacity", .9);
           tooltip.html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: $${d.data.value}`)
                  .attr("data-value", d.data.value)
                  .style("left", (d3.event.pageX + 5) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
         })
         .on("mouseout", function() {
           tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
         });

    const legendData = [...new Set(data.children.map(item => item.category))];

    const legend = d3.select("#legend")
                     .html("<h3>Legend</h3>");

    legend.selectAll(".legend-item")
          .data(legendData)
          .enter()
          .append("div")
          .attr("class", "legend-item")
          .html(d => d)
          .style("color", d => colorScale(d));
  });
