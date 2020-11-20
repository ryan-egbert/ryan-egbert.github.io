let LANG_DATA;
let NUM = 1;

d3.csv("../data/dry_run.csv").then(csv => {
    LANG_DATA = csv;
    console.log(LANG_DATA);
    console.log("LANG_DATA finished")
})


let height = 800;
let width = 1000;
let projection = d3.geoMercator()
    .scale(130)
    .translate([width/2,height/1.75]);

let path = d3.geoPath().projection(projection);

function init() {
    createMap();
    document.getElementById("find")
        .addEventListener("click", function(e) {
            addLangs(document.getElementById("select").value);
        });
}

function addLangs(val) {
    let countries;
    if (val == 1) {
        countries = {
            "eng": {
                parent: "ang",
                lat: 53.0,
                lon: -1.0
            },
            "deu": {
                parent: "goh",
                lat: 48.649,
                lon: 12.4676
            },
            "ang": {
                parent: "goh",
                lat: 51.06,
                lon: -1.31
            },
            "goh": {
                parent: "goh",
                lat: 52.0,
                lon: 10.0
            },
        }
    }
    else {
        countries = {
            "fra": {
                parent: "lat",
                lat: 48.0,
                lon: 2.0
            },
            "spa": {
                parent: "lat",
                lat: 40.4414,
                lon: -1.11788
            },
            "lat": {
                parent: "lat",
                lat: 41.9026,
                lon: 12.4502
            }
        }
    }

    let data = [];
    for (let i = 0; i < LANG_DATA.length; i++) {
        if (val == 1 && (LANG_DATA[i].code == "eng" || LANG_DATA[i].code == "deu" || LANG_DATA[i].code == "ang" || LANG_DATA[i].code == "goh")) {
            data.push(LANG_DATA[i]);
        }
        else if (val == 2 && (LANG_DATA[i].code == "fra" || LANG_DATA[i].code == "spa" || LANG_DATA[i].code == "lat")) {
            data.push(LANG_DATA[i]);
        }
    }

    populateMap(data, countries)
}