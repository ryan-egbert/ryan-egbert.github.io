import scrapy

class EthnologueSpider(scrapy.Spider):
    name = "ethnologue_spider"
    start_urls = ["https://www-ethnologue-com.dist.lib.usu.edu/browse/names"]
    