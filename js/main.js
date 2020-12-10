let LANG_DATA = {};
let COUNTRIES = {};
let NUM = 1;
// const COLORS;

d3.csv("../data/languages.csv").then(csv => {
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
            if (document.getElementById(lang.id).classList.contains("selected")){
                document.getElementById(lang.id).classList.remove("selected");
            }
            else{
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

d3.csv("../data/countries.csv").then(csv =>  {
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
    .call(zoom);
    

function init() {
    createMap();
    document.getElementById("find")
        .addEventListener("click", function(e) {
            let langs = [];
            let lis = document.getElementsByClassName("selected");
            console.log(lis);
            for (let i = 0; i < lis.length; i++) {
                langs.push(lis[i].id);
            }
            addLangs(langs);
        });
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