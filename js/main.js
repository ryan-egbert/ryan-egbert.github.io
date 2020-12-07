let LANG_DATA;
let NUM = 1;

d3.csv("../data/dry_run.csv").then(csv => {
    LANG_DATA = csv;
    console.log(LANG_DATA);
    console.log("LANG_DATA finished")
})


let height = 550;
let width = 1000;
let projection = d3.geoMercator()
    .scale(170)
    .translate([width/2,height/1.75]);

let path = d3.geoPath().projection(projection);

var zoom = d3.zoom()
      .scaleExtent([1, 35])
      .on('zoom', zoomed);

function zoomed() {
    d3.select("#map")
      .selectAll('path,line,circle') // To prevent stroke width from scaling
      .attr('transform', d3.event.transform);
  }


d3.select("#map")
    .attr("cursor", "pointer")
    .call(zoom);
    

function init() {
    createMap();
    document.getElementById("find")
        .addEventListener("click", function(e) {
            addLangs(document.getElementById("select").value, document.getElementById("select2").value);
        });
}

function addLangs(val1, val2) {
    let countries = {};
    if (val1 == 1) {
        countries["eng"] = {
            parent: "ang",
            lat: 53.0,
            lon: -1.0
        }
        countries["ang"] = {
            parent: "goh",
            lat: 51.06,
            lon: -1.31
        }
        countries["goh"] = {
            parent: "goh",
            lat: 52.0,
            lon: 10.0
        }
    }
    else if (val1 == 2){
        countries["fra"] = {
            parent: "lat",
            lat: 48.0,
            lon: 2.0
        }
        countries["lat"] = {
            parent: "lat",
            lat: 41.9026,
            lon: 12.4502
        }
    }

    if (val2 == 1) {
        countries["deu"] = {
            parent: "goh",
            lat: 48.649,
            lon: 12.4676
        }
        countries["goh"] = {
            parent: "goh",
            lat: 52.0,
            lon: 10.0
        }
    }
    else if (val2 == 2){
        countries["spa"] = {
            parent: "lat",
            lat: 40.4414,
            lon: -1.11788
        }
        countries["lat"] = {
            parent: "lat",
            lat: 41.9026,
            lon: 12.4502
        }
    }

    let data = [];
    for (let i = 0; i < LANG_DATA.length; i++) {
        if (val1 == 1 && (LANG_DATA[i].code == "eng" || LANG_DATA[i].code == "ang" || LANG_DATA[i].code == "goh")) {
            data.push(LANG_DATA[i]);
        }
        else if (val1 == 2 && (LANG_DATA[i].code == "fra" || LANG_DATA[i].code == "lat")) {
            data.push(LANG_DATA[i]);
        }
        if (val2 == 1 && (LANG_DATA[i].code == "deu" || LANG_DATA[i].code == "goh")) {
            data.push(LANG_DATA[i]);
        }
        else if (val2 == 2 && (LANG_DATA[i].code == "spa" || LANG_DATA[i].code == "lat")) {
            data.push(LANG_DATA[i]);
        }
    }

    populateMap(data, countries)
}


function filterLanguages() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("filter");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}