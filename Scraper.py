#from google.colab import auth
from lxml import html
import requests
import json
import urllib.request
from bs4 import BeautifulSoup

#Currently requires google auth
#auth.authenticate_user()

#import gspread
#from oauth2client.client import GoogleCredentials

#gc = gspread.authorize(GoogleCredentials.get_application_default())

#Name must match, if it is changed in the file it must be changed here as well
#worksheet = gc.open('Beer Virus Automation').sheet1

#xpaths = worksheet.col_values(3)
#urls = worksheet.col_values(2)

total = 0

################################################################################

#Alabama
url = urllib.request.urlopen("https://services7.arcgis.com/4RQmZZ0yaZkGR1zy/arcgis/rest/services/COV19_Public_Dashboard_ReadOnly/FeatureServer/0/query?f=json&where=CONFIRMED%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22CONFIRMED%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true")
content = url.read()
jc = json.loads(content)
AL = jc['features'][0]['attributes']['value']
print(AL)
total += AL

################################################################################

#Alaska
url = "http://dhss.alaska.gov/dph/Epi/id/Pages/COVID-19/monitoring.aspx"
xpathh = '//*[@id="ctl00_PlaceHolderMain_PageContent__ControlWrapper_RichHtmlField"]/div[2]/table/tbody/tr[9]/td[3]/p/text()'

page = requests.get(url)
tree = html.fromstring(page.content)
cnt = tree.xpath(xpathh)

AK = cnt[0]
print(AK)
total += int(AK)

################################################################################

#Output Handling
#store = gc.open_by_url('https://docs.google.com/spreadsheets/d/19PpoExlTc7I4V-HpxvrqDGDrKuRND10Hm3hA_pJvnjw/edit?usp=sharing').sheet2
#total = store.range('F1:F52')
print("total: " + str(total))
#worksheet.update_cells(total)
