function createMap() {
    let svg = d3.select("#map")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("class", "g-map");

    d3.json("../data/world_countries.json").then(json => {
        console.log(json);
        d3.select("#map").selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "none")
            .style("fill", "black")
            .style("opacity", "0.3")
    });
}

function populateMap(csv, countries) {
    d3.select("#map").selectAll("line").remove();
    d3.select("#map").selectAll("circle").remove();

    d3.select("#map").selectAll("line")
        .data(csv)
        .enter()
        .append("line")
        .attr("x1", d => {
            return projection([d.lon, d.lat])[0];
        })
        .attr("y1", d => {
            return projection([d.lon, d.lat])[1];
        })
        .attr("x2", d => {
            let par = countries[d.code].parent;
            return projection([countries[par].lon, countries[par].lat])[0];
        })
        .attr("y2", d => {
            let par = countries[d.code].parent;
            return projection([countries[par].lon, countries[par].lat])[1];
        })
        .style("stroke", "#555555")

    d3.select("#map").selectAll("circle")
        .data(csv)
        .enter()
        .append("circle")
        .attr("cx", d => {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", d => {
            return projection([d.lon, d.lat])[1];
        })
        .attr("class", d => d.code)
        .attr("r", 3)
        .style("fill", d => d.color)
        .on("mouseover", (d,i) => {
            d3.select(event.currentTarget)
                .attr("r", 7);
            console.log("in")
            let text = "";
            text += `Language: ${d.language}<br>`
            text += `Worldwide Speakers: (number of speakers)<br>`
            text += `Locations: ${d.macroareas.replace("|", " ")}<br>`
            d3.select("#info").html(text);
        })
        .on("mouseout", (d,i) => {
            d3.select(event.currentTarget)
                .attr("r", 3);
        })
}