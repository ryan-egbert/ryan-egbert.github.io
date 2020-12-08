import configparser
from fetch_lang_data import *
from compile_lang_data import *

f,l,d = fetchLanguages("../glottolog/languoids/tree/")
saveLanguages(l, "../data/languages.csv")
saveFamilies(f, "../data/families.csv")