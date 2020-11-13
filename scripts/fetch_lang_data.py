import configparser
import os
import re

LANG_RE = r'^.*\/(\w+)$'
FAMILY_RE = r'^.*\/(\w+)\/(\w+)$'

class Language:
    def __init__(self, name, family, lat, lon, id, countries, macroareas, status):
        self.id = id
        self.name = name
        self.parentFamily = family
        self.lat = lat
        self.lon = lon
        self.countriesStr = countries
        self.countries = []
        self.macroareasStr = macroareas
        self.macroareas = []
        self.status = status
        self._parselists()

    def _parselists(self):
        if self.countriesStr != None:
            self.countries = self.countriesStr.split('\n')
        if self.macroareasStr != None:
            self.macroareas = self.macroareasStr.split('\n')

class Family:
    def __init__(self, name, identifier, family):
        self.name = name
        self.identifier = identifier
        self.parentFamily = family

def fetchLanguages(path):
    allLanguages = []
    allFamilies = []
    allDialects = []
    for root, dirs, files in os.walk(path):
        # print(root)
        if "md.ini" in files:
            config = configparser.ConfigParser()
            config.read(os.path.join(root, "md.ini"))

            level = config['core']['level']
            if level == 'family':
                name = None
                id = None
                family = None

                m = re.match(FAMILY_RE, root)
                if m:
                    family = m.group(1)
                
                if config.has_section('core') and config.has_option('core', 'name'):
                    name = config.get('core', 'name')
                if config.has_section('identifier') and config.has_option('identifier', 'wals'):
                    id = config.get('identifier', 'wals')
                allFamilies.append(Family(name, id, family))
            elif level == 'language':
                name = None
                family = None
                lat = None
                lon = None
                iso = None
                countries = None
                macroareas = None
                status = None

                m = re.match(LANG_RE, root)
                if m:
                    family = m.group(1)
                    # print(family)

                if config.has_section('core') and config.has_option('core', 'name'):
                    name = config.get('core', 'name')
                if config.has_section('core') and config.has_option('core', 'latitude'):
                    lat = config.get('core', 'latitude')
                if config.has_section('core') and config.has_option('core', 'longitude'):
                    lon = config.get('core', 'longitude')
                if config.has_section('core') and config.has_option('core', 'iso639-3'):
                    iso = config.get('core', 'iso639-3')
                if config.has_section('core') and config.has_option('core', 'countries'):
                    countries = config.get('core', 'countries')
                if config.has_section('core') and config.has_option('core', 'macroareas'):
                    macroareas = config.get('core', 'macroareas')
                if config.has_section('endangerment') and config.has_option('endangerment', 'status'):
                    status = config.get('endangerment', 'status')

                # print(countries.split("\n"))
                allLanguages.append(Language(name,family,lat,lon,iso,countries,macroareas,status))
            elif level == 'dialect':
                allDialects.append(config['core']['name'])


    print(f"Languages: {len(allLanguages)}")
    print(f"Dialects : {len(allDialects)}")
    print(f"Families : {len(allFamilies)}")

    return (allFamilies, allLanguages, allDialects)


