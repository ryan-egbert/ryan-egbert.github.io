import scrapy

letters = {
    'A': 'B',
    'B': 'C',
    'C': 'D',
    'D': 'E',
    'E': 'F',
    'F': 'G',
    'G': 'H',
    'H': 'I',
    'I': 'J',
    'J': 'K',
    'K': 'L',
    'L': 'M',
    'M': 'N',
    'N': 'O',
    'O': 'P',
    'P': 'Q',
    'Q': 'R',
    'R': 'S',
    'S': 'T',
    'T': 'U',
    'U': 'V',
    'V': 'W',
    'W': 'X',
    'X': 'Y',
    'Y': 'Z',
}

current = 'A'

class EthnologueSpider(scrapy.Spider):
    name = "ethnologue_spider"
    start_urls = ["https://www.ethnologue.com/browse/names"]

    def parse(self, response):
        global current
        LANG_SELECTOR = '.field-content'
        for lang in response.css(LANG_SELECTOR):
            NAME_SELECTOR = 'a::text'
            LINK_SELECTOR = 'a::attr(href)'
            yield {
                'name': lang.css(NAME_SELECTOR).extract_first(),
                'href': lang.css(LINK_SELECTOR).extract_first()
            }

        
        NEXT_PAGE_TEXT_SELECTOR = '.views-summary a::text'
        np_text = response.css(NEXT_PAGE_TEXT_SELECTOR).extract()
        index = 0
        while np_text[index] != letters[current]:
            index += 1
        
        current = letters[current]

        NEXT_PAGE_SELECTOR = '.views-summary a::attr(href)'
        next_page = response.css(NEXT_PAGE_SELECTOR).extract()
        print(next_page[index])
        if next_page[index]:
            yield scrapy.Request(
                response.urljoin(next_page[index]),
                callback=self.parse
            )