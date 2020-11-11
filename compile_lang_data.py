import os

def saveLanguages(arr, fileName):
    with open(fileName, 'w') as f:
        f.write('id,name,parent,latitude,longitude,countries,macroareas,status\n')
        for lang in arr:
            f.write(f"{lang.id},{lang.name},{lang.parentFamily},{lang.lat},{lang.lon},{'|'.join(lang.countries)},{'|'.join(lang.macroareas)},{lang.status}\n")

def saveFamilies(arr, fileName):
    with open(fileName, 'w') as f:
        f.write('name,identifier,parent\n')
        for fam in arr:
            f.write(f"{fam.name},{fam.identifier},{fam.parentFamily}\n")