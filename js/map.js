



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



function populateMapRelationships(data, origin, cw) {
    d3.select("#map").selectAll("line").remove();
    d3.select("#map").selectAll("circle").remove();
    d3.select("#map").selectAll("rect").remove();

    d3.select("#map").selectAll("line")
        .data(data)
        .enter()
        .append("line").classed("line", true)
        .attr("x1", d => {
            if (d.lon == "None" || d.lat == "None") {
                projection([0,0])[0];
            }
            return projection([d.lon, d.lat])[0];
        })
        .attr("y1", d => {
            if (d.lon == "None" || d.lat == "None") {
                projection([0,0])[1];
            }
            return projection([d.lon, d.lat])[1];
        })
        .attr("x2", d => {
            if (origin.lon == "None" || origin.lat == "None") {
                projection([0,0])[0];
            }
            return projection([origin.lon, origin.lat])[0];
        })
        .attr("y2", d => {
            if (origin.lon == "None" || origin.lat == "None") {
                projection([0,0])[1];
            }
            return projection([origin.lon, origin.lat])[1];
        })
        .style("stroke", "#555555")

    d3.select("#map").selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        
      
        .attr("cx", d => {
            // let par = countries[d.code].parent;
            // let index = 0;
            // if (d.country in countries) {
            //     if (countries[d.country].length > 1) {
            //         for (let i = 0; i < countries[d.country].length; i++) {
            //             if (countries[d.country][i] == d.code) {
            //                 index = i * 10;
            //             }
            //         }
            //     }
            // }
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", d => {
            // let par = countries[d.code].parent;
            return projection([d.lon, d.lat])[1];
        
        })
        .attr("class", d => d.code)
        .attr("r", d => {
            if (d.language == origin.name) {
                return 6;
            }
            return 3;
        })
        .style("fill", d => {
            if (d.language == origin.name) {
                return "white";
            }
            return cw(d.code);
        })
        .style("stroke", "gray")
        .style("stroke-width", "0.3px")
        
        .on("mouseover", function (d,i)  {
            // Bugged code for position on tooltip
            // const top = 250 + d3.mouse(this)[1]
            // const left = 10 + d3.mouse(this)[0]
            if (d.language != origin.name) {
                d3.select(this)
                    .attr("r", 5)
            }
            let text = "";
            text += `Language: ${d.language}<br>`
            text += `Language Status: ${d.status}<br>`
            text += `# of countries: ${d.numCountries}`
            // text += `Locations: ${d.macroareas.replace("|", " ")}<br>`
            d3.select("#infoTooltip")
            .append("div")
            .attr("cursor", "pointer")
            .attr("id", "info")
            .style("position", "absolute")
            .style("background-color", cw(d.code))
            .style("left", (d3.mouse(this)[0]+20) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
          
            .style("text-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "3px")
            .style("padding", "2px")
            d3.select("#info").html("<p>" + text + "</p>");
            
        })
        .on("mouseout", function (d,i) {
            if (d.language != origin.name) {
                d3.select(this)
                    .attr("r", 3);
            }
            d3.select("#info").remove()
        })
}

function populateMap(data, countries, cw) {
    let depth_ = 3;
    d3.select("#map").selectAll("line").remove();
    d3.select("#map").selectAll("circle").remove();
    d3.select("#map").selectAll("rect").remove();

    // d3.select("#map").selectAll("line")
    //     .data(data)
    //     .enter()
    //     .append("line")
    //     .attr("x1", d => {
    //         return projection([d.lon, d.lat])[0];
    //     })
    //     .attr("y1", d => {
    //         return projection([d.lon, d.lat])[1];
    //     })
    //     .attr("x2", d => {
    //         let par = countries[d.code].parent;
    //         return projection([countries[par].lon, countries[par].lat])[0];
    //     })
    //     .attr("y2", d => {
    //         let par = countries[d.code].parent;
    //         return projection([countries[par].lon, countries[par].lat])[1];
    //     })
    //     .style("stroke", "#555555")

    d3.select("#map").selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
    
        .attr("cx", d => {
            // let par = countries[d.code].parent;
            let index = 0;
            if (d.country in countries) {
                if (countries[d.country].length > 1) {
                    for (let i = 0; i < countries[d.country].length; i++) {
                        if (countries[d.country][i] == d.code) {
                            index = i * 10;
                        }
                    }
                }
            }
            return projection([d.lon, d.lat])[0] + index;
        })
        .attr("cy", d => {
            // let par = countries[d.code].parent;
            return projection([d.lon, d.lat])[1];
        
        })
        .attr("class", d => d.code)
        
        .attr("r", 3)
        .style("fill", d => cw(d.code))
        .style("stroke", "black")
        .style("stroke-width", "0.2px")
        
        .on("mouseover", function (d,i)  {
            // const top = 180 + d3.mouse(this)[1]
            // const left = 5 + d3.mouse(this)[0]
            d3.select(this)
                .attr("r", 5)
            let text = "";
            text += `Country: ${d.countryName}<br>`
            text += `Language: ${d.language}<br>`
            text += `Language Status: ${d.status}<br>`
            // text += `# of countries where language is spoken: ${d.numCountries}`
            // text += `Locations: ${d.macroareas.replace("|", " ")}<br>`
            d3.select("#infoTooltip")
            .append("div")
            
            .attr("id", "info")
            .style("position", "absolute")
            .style("left", (d3.mouse(this)[0]) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
            // .style("top",  top + "px")
            // .style("left", left + "px")
            .style("background-color", cw(d.code))
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "10px")
            .style("padding", "2px")
            d3.select("#info").html("<p>" + text + "</p>");
            
        })
        .on("mouseout", function (d,i) {
            d3.select(this)
                .attr("r", 3);
            d3.select("#info").remove()
        })

}

        

