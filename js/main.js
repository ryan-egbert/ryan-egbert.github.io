let LANG_DATA = {};
let COUNTRIES = {};
let NUM = 1;
// const COLORS;
let mode = 0;

// document.getElementById("depth")
//     .addEventListener("change", function(e) {
//         document.getElementById("depth-value").innerHTML = "Depth: " + document.getElementById("depth-slider").value;
//     });

document.getElementById("multi")
    .addEventListener("click", function(e) {
        mode = 0;
        let other = document.getElementById("relationship");
        if (other.classList.contains("selected-tab")) {
            other.classList.remove("selected-tab");
        }
        document.getElementById("multi").classList.add("selected-tab");
});

document.getElementById("relationship")
    .addEventListener("click", function(e) {
        mode = 1;
        let other = document.getElementById("multi");
        if (other.classList.contains("selected-tab")) {
            other.classList.remove("selected-tab");
        }
        document.getElementById("relationship").classList.add("selected-tab");
});

d3.csv("/vis-final-project/data/languages.csv").then(csv => {
    csv.sort((a,b) => {
        let name1 = a.name.toUpperCase();
        let name2 = b.name.toUpperCase();
        if (name1 > name2) {
            return 1
        }
        return -1;
    })
    for (let i = 0; i < csv.length; i++) {
        let lang = csv[i];
        let name = lang.name;
        let ul = document.getElementById("myUL");
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.innerHTML = name;
        li.appendChild(a);
        li.setAttribute("id", lang.id);
        li.addEventListener("click", function(e) {
            if (mode == 0) {
                if (document.getElementById(lang.id).classList.contains("selected")){
                    document.getElementById(lang.id).classList.remove("selected");
                }
                else {
                    document.getElementById(lang.id).classList.add("selected");
                }
            }
            else if (mode == 1) {
                let allSelected = document.getElementsByClassName("selected");
                for (let i = 0; i < allSelected.length; i++) {
                    allSelected[i].classList.remove("selected");
                }
                document.getElementById(lang.id).classList.add("selected");
            }
        });
        ul.appendChild(li);
        LANG_DATA[lang.id] = {
            name: lang.name,
            parents: lang.parent.split("|"),
            lat: lang.latitude,
            lon: lang.longitude,
            countries: lang.countries.split("|").slice(1),
            status: lang.status,
        }
    }
    console.log("LANG_DATA finished");
});

d3.csv("/vis-final-project/data/countries.csv").then(csv =>  {
    for (let i = 0; i < csv.length; i++) {
        var country = csv[i];
        COUNTRIES[country.code] = {
            lat: country.lat,
            lon: country.lon,
            name: country.name
        }
    }
    console.log("COUNTRIES finished");
});


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
    .call(zoom, zoomed);
    

function init() {
    createMap();
    document.getElementById("find")
        .addEventListener("click", function(e) {
            if (mode == 0) {
                let langs = [];
                let lis = document.getElementsByClassName("selected");
                console.log(lis);
                for (let i = 0; i < lis.length; i++) {
                    langs.push(lis[i].id);
                }
                addLangs(langs);
            }
            else if (mode == 1) {
                let depth = document.getElementById("depth-range").value;
                let langs = document.getElementsByClassName("selected");
                if (langs.length != 1) {
                    console.log("something went wrong...");
                }
                let lang = langs[0];
                let parents = LANG_DATA[lang.id].parents;
                let origin = LANG_DATA[lang.id];
                let family;
                if (depth > parents.length) {
                    family = parents[0];
                }
                else {
                    family = parents[parents.length - depth];
                }
                addLangsRelationships(findRelatedLanguages(family), origin);
            }
        });
    document.getElementById("clear")
        .addEventListener("click", function(e) {
            let lis = document.getElementsByClassName("selected");
            for (let i = lis.length - 1; i >= 0; --i) {
                document.getElementById(lis[i].id).classList.remove("selected");
            
            }
            addLangs([]);
        });
    }

function addLangsRelationships(langs, origin) {
    let data = [];
    let colorData = [];
    // let origin = LANG_DATA[originId];
    // console.log(originId)
    for (let i = 0; i < langs.length; i++) {
        let lang = langs[i];
        let langCountries = LANG_DATA[lang].countries;
        let status = LANG_DATA[lang].status;
        colorData.push(lang);
        data.push({
            code: lang,
            // color: COLORS[i % COLORS.length],
            lat: LANG_DATA[lang].lat,
            lon: LANG_DATA[lang].lon,
            language: LANG_DATA[lang].name,
            status: status,
            numCountries: langCountries.length
        });
    }
    let colorWheel = d3.scaleOrdinal().domain(colorData).range(d3.schemeSet3);
    populateMapRelationships(data, origin, colorWheel)
}

function addLangs(langs) {
        let data = [];
        let countries = {};
        let colorData = [];
        for (let i = 0; i < langs.length; i++) {
            let lang = langs[i];
            let langCountries = LANG_DATA[lang].countries;
            let status = LANG_DATA[lang].status;
            for (let j = 0; j < langCountries.length; j++) {
                let country = langCountries[j];
                if (country in countries) {
                    countries[country].push(lang);
                }
                else {
                    countries[country] = [lang]
                }
                colorData.push(lang);
                data.push({
                    code: lang,
                    // color: COLORS[i % COLORS.length],
                    lat: COUNTRIES[country].lat,
                    lon: COUNTRIES[country].lon,
                    language: LANG_DATA[lang].name,
                    country: country,
                    countryName: COUNTRIES[country].name,
                    status: status,
                    numCountries: langCountries.length
                });
            }
        }
        let colorWheel = d3.scaleOrdinal().domain(colorData).range(d3.schemeSet3);
        populateMap(data, countries, colorWheel)
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

function findRelatedLanguages(family) {
    let langs = [];
    for (const lang in LANG_DATA) {
        // console.log(LANG_DATA[lang])
        if (LANG_DATA[lang].parents.includes(family)) {
            langs.push(lang);
        }
    }
    console.log(langs)
    return langs;
}

// Beginning of modal for about us

var modal = document.getElementById("about");

// Opens the modal
var btn = document.getElementById("aboutLink");

// Closes the modal
var span = document.getElementsByClassName("close")[0];

// Click the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// Click on "X" to close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// Click anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
