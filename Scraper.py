#from google.colab import auth
from lxml import html
import requests
import json
import selenium
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import sys
import os
import PyPDF2
import argparse
import tempfile
import urllib.request
import re
import urllib3
from tqdm import tqdm
import time

print("NO LONGER UP TO DATE, WILL MOST LIKELY ERROR")

def int2File(number, filename):
    file = open(os.getcwd() + "/arcgis_test/known_accurate/" + filename, "w+")
    file.write(str(number))
    file.close()


options = Options()
options.add_argument("--headless")
profile = webdriver.FirefoxProfile()
profile.set_preference('network.http.phishy-userpass-length', 255)

driver = webdriver.Firefox(executable_path=os.getcwd()+"/geckodriver",options=options,firefox_profile=profile)

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

#Alabama
url = urllib.request.urlopen("https://services7.arcgis.com/4RQmZZ0yaZkGR1zy/arcgis/rest/services/COV19_Public_Dashboard_ReadOnly/FeatureServer/0/query?f=json&where=CONFIRMED%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22CONFIRMED%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true")
content = url.read()
jc = json.loads(content)
AL = jc['features'][0]['attributes']['value']
print(AL)
total += AL
int2File(AL, "AL")

#Alaska
url = "http://dhss.alaska.gov/dph/Epi/id/Pages/COVID-19/monitoring.aspx"
xpathh = '//*[@id="ctl00_PlaceHolderMain_PageContent__ControlWrapper_RichHtmlField"]/div[2]/table/tbody/tr[9]/td[3]/p/text()'

page = requests.get(url)
tree = html.fromstring(page.content)
cnt = tree.xpath(xpathh)

AK = cnt[0]
print(AK)
total += int(AK)
int2File(AK, "AK")

#Arizona
#lol no

#Arkansas
driver.get("https://www.healthy.arkansas.gov/programs-services/topics/novel-coronavirus")
AR = int(driver.find_element_by_xpath("/html/body/div[7]/div[1]/table[4]/tbody/tr[1]/td[2]/b").text.replace(',', ''))
total += AR
print(str(AR))
int2File(AR, "AR")

#California
driver.get("https://www.latimes.com/projects/california-coronavirus-cases-tracking-outbreak/")
CA = int(driver.find_element_by_xpath("/html/body/article/div[1]/section[2]/div[1]/div[1]/p[1]").text.replace(',', ''))
total += CA
print(str(CA))
int2File(CA, "CA")

#Colorado (blaze it)
#too fkin tired to figure out canvas in js

#Connecticut
#KILL ME IT'S A PDF
f = tempfile.TemporaryFile()
driver.get("http://portal.ct.gov/Coronavirus")
pdfurl = driver.find_element_by_xpath("/html/body/div[1]/div/div[2]/main/section[2]/div/div[2]/p[4]/span/strong/a").get_attribute('href')

urllib3.disable_warnings()
urllib3.util.ssl_.DEFAULT_CIPHERS += 'HIGH:!DH:!aNULL'
try:
    urllib3.contrib.pyopenssl.DEFAULT_SSL_CIPHER_LIST += 'HIGH:!DH:!aNULL'
except AttributeError:
    # no pyopenssl support used / needed / available
    pass


resp = requests.get(pdfurl, stream=True, verify=False)

# read 1024 bytes every time 
buffer_size = 1024

# get the total file size
file_size = int(resp.headers.get("Content-Length", 0))

# progress bar, changing the unit to bytes instead of iteration (default by tqdm)
progress = tqdm(resp.iter_content(buffer_size), f"Downloading file", total=file_size, unit="B", unit_scale=True, unit_divisor=1024)

for data in progress:
        # write data read to the file
        f.write(data)
        # update the progress bar manually
        progress.update(len(data))

pdfReader = PyPDF2.PdfFileReader(f)
firstPage = pdfReader.getPage(0).extractText().replace(',', '')

#print(firstPage)

CT = int(re.findall(r'-?\d+\.?\d*', re.findall("total of \n\d+", firstPage)[0])[0])
print(str(CT))
total += CT
f.close()
int2File(CT, "CT")



#Delaware
#Rasmit's job


#Flordia (insert flordiaman joke)
'''
driver.get("https://experience.arcgis.com/experience/96dd742462124fa0b38ddedb9b25e429/")

while len(driver.find_elements_by_xpath("/html/body/div/div/div[2]/div/div/div/margin-container/full-container/div[2]/margin-container/full-container/div/div/div/div[2]/svg/g[2]/svg/text")) == 0:
    time.sleep(.1)

FL = int(driver.find_element_by_xpath("/html/body/div/div/div[2]/div/div/div/margin-container/full-container/div[2]/margin-container/full-container/div/div/div/div[2]/svg/g[2]/svg/text").replace(",", ""))
print(FL)
total += FL
'''
#Georgia
driver.get("https://dph.georgia.gov/covid-19-daily-status-report")
GA = int(re.findall(r"\d+", re.sub(r'\([^)]*\)', '', driver.find_element_by_xpath("/html/body/div[1]/div/div[2]/div/div[3]/div[1]/div/main/div[2]/table[1]/tbody/tr[1]/td[2]").text.replace(",", "")))[0])
print(str(GA))
total += GA
int2File(GA, "GA")

#Hawaii
driver.get("https://hawaiicovid19.com/")
HI = int(driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/div/main/article/div/div/div[8]/div/div/div[2]/div/div/div/table/tbody/tr[5]/td[2]").text.replace(",", ""))
print(str(HI))
total += HI
int2File(GA, "GA")


#Idaho
#In spanish it would be jo
driver.get("https://coronavirus.idaho.gov/")
#they seem to ratelimit, try waiting?
i = 0
while True:
    try:
        ID = int(driver.find_element_by_css_selector(".row-11 > td:nth-child(3)").text.replace(",", ""))
    except selenium.common.exceptions.NoSuchElementException:
        i += 1
        if i > 2:
            print("Idaho is being difficult, so we're gonna just load the page again")
            driver.get("https://coronavirus.idaho.gov/")
            i=0
        else:
            print("Idaho ratelimit, waiting 8 seconds")
            time.sleep(8)
        continue
    break
print(str(ID))
total += ID
int2File(ID, "ID")


#Illinois
driver.get("https://www.dph.illinois.gov/topics-services/diseases-and-conditions/diseases-a-z-list/coronavirus")
IL = int(driver.find_element_by_xpath("/html/body/div[1]/div[3]/div/article/div/div/div/dl/dd[1]/div[1]/div[1]/h3").text.replace(",", ""))
print(str(IL))
total += IL
int2File(IL, "IL")

#Indiana
#Arcgis quackery, to do later


#Iowa
#also arcgis


#Kansas
driver.get("https://govstatus.egov.com/coronavirus")
#Yes, this script will only work for years 2000-2099, if you really need it to last longer, fix it yourself
KS = int(re.findall(r"\d+", re.findall(r"\d{1,2} 2\d{3}: \d+", driver.find_element_by_xpath("/html/body/div[1]/div[2]/div/p").text.replace(",", ""))[0])[-1])
print(str(KS))
total += KS
int2File(KS, "KS")

#Kentucky (land of the fried chicken)
driver.get("https://govstatus.egov.com/kycovid19")
while True:
    try:
        #captcha issues
        try:
            WebDriverWait(driver, 3).until(EC.alert_is_present(),
                                        'Timed out waiting for PA creation ' +
                                        'confirmation popup to appear.')

            alert = driver.switch_to.alert
            alert.accept()
        except TimeoutException:
            print("No kentucky captcha")
        KY = int(re.findall(r'\d+', re.findall(r'Positive: \d+', driver.find_elements_by_class_name("alert-success")[-1].text.replace(',', ""))[0])[0])
    except IndexError:
        print("kentucky ratelimit, sleeping for 10")
        time.sleep(10)
        continue
    break
print(str(KY))
total += KY
int2File(KY, "KY")

#Louisiana (French people..?)
#Arcgis (gross)


#Maine
driver.get("https://www.maine.gov/dhhs/mecdc/infectious-disease/epi/airborne/coronavirus.shtml")
ME = int(driver.find_element_by_xpath("/html/body/div[2]/div[3]/div[3]/table[1]/tbody/tr[2]/td[1]").text.replace(",", ""))
print(str(ME))
total += ME
int2File(ME, "ME")

'''
#Maryland
driver.get("https://coronavirus.maryland.gov")
while True:
    try:
        MD = int(re.findall(r"\d+", driver.find_element_by_xpath("/html/body/div[2]/div[5]/div[3]/div/div[1]/div/section[4]/div/div/div[2]/div/div/p[1]").text.replace(",", ""))[0])
    except selenium.common.exceptions.NoSuchElementException:
        print("Maryland ratelimit, sleeping for 7 seconds")
        time.sleep(7)
        continue
    break
print(str(MD))
total += MD
int2File(MD, "MD")
'''

#Massachusetts
driver.get("https://www.mass.gov/info-details/covid-19-cases-quarantine-and-monitoring")
# the thing doesnt load instantly, so we test it until it's ready
while True:
    if (driver.find_element_by_xpath("/html/body/div[1]/main/div[2]/div/div/div[1]/div/div/div/table/tbody/tr").text == ""):
        time.sleep(.1)
        continue
    break
MA = int(re.findall(r"\d+", driver.find_element_by_xpath("/html/body/div[1]/main/div[2]/div/div/div[1]/div/div/div/table/tbody/tr").text.replace(",", ""))[-1])
print(str(MA))
total += MA
int2File(MA, "MA")

#Michigan
driver.get("https://www.michigan.gov/coronavirus/0,9753,7-406-98163-520743--,00.html")
MI = int(driver.find_element_by_xpath("/html/body/div[3]/div[4]/div/div/div[3]/table[1]/tbody/tr[40]/td[2]/p/strong").text.replace(",", ""))
print(str(MI))
total += MI
int2File(MI, "MI")

#Minnesota
driver.get("https://www.health.state.mn.us/diseases/coronavirus/situation.html")
MN = int(re.findall(r"\d+", driver.find_element_by_xpath("/html/body/div[3]/div/div[2]/div[1]/ul[1]/li[1]").text.replace(",", ""))[-1])
print(str(MN))
total += MN
int2File(MN, "MN")

''' it broke
#Mississippi
driver.get("https://msdh.ms.gov/msdhsite/_static/14,0,420.html")
i = 0
while True:
    try:
        MS = int(driver.find_element_by_xpath("/html/body/div[1]/div[3]/div[6]/div/table/tbody/tr[53]/td[2]").text.replace(",", ""))
    except selenium.common.exceptions.NoSuchElementException:
        i += 1
        if (i > 2):
            print("Mississippi is being difficult, let's get the site again")
            driver.get("https://msdh.ms.gov/msdhsite/_static/14,0,420.html")
            i=0
        else:
            print("Mississippi ratelimit, sleeping for 7 seconds")
            time.sleep(7)
        continue
    break
print(str(MS))
total += MS
'''
'''
#Missouri (I'm in MISERY)
while True:
    try:
        driver.get("https://health.mo.gov/living/healthcondiseases/communicable/novel-coronavirus/")
    except selenium.common.exceptions.WebDriverException:
        continue
    break
MO = int(driver.find_element_by_xpath("/html/body/div/div/section[1]/div[6]/table/tbody/tr[2]/td").text.replace(",", ""))
print(str(MO))
total += MO
int2File(MO, "MO")
'''
#Montana
#ARCGIS GOD DAMMIT


#Nebraska
driver.get("http://dhhs.ne.gov/Pages/Coronavirus.aspx#SectionLink3")
NE = int(re.findall(r'\d+', driver.find_element_by_css_selector("#ctl00_PlaceHolderMain_ctl08__ControlWrapper_RichHtmlField > ul:nth-child(27) > li:nth-child(1)"
                                                         ).text.replace(",", ""))[-1])
print(str(NE))
total += NE
int2File(NE, "NE")

#Nevada
driver.get("https://app.powerbigov.us/view?r=eyJrIjoiMjA2ZThiOWUtM2FlNS00MGY5LWFmYjUtNmQwNTQ3Nzg5N2I2IiwidCI6ImU0YTM0MGU2LWI4OWUtNGU2OC04ZWFhLTE1NDRkMjcwMzk4MCJ9")
#Thing doesnt load instantly, so wait until you see the thing you need to check
while (len(driver.find_elements_by_css_selector("visual-container-modern.visual-container-component:nth-child(12) > transform:nth-child(1) > div:nth-child(1) > div:nth-child(3) > visual-modern:nth-child(1) > div:nth-child(1) > svg:nth-child(2) > g:nth-child(1) > text:nth-child(1) > tspan:nth-child(1)"))
       == 0):
    time.sleep(.1)
NV = int(driver.find_element_by_css_selector("visual-container-modern.visual-container-component:nth-child(12) > transform:nth-child(1) > div:nth-child(1) > div:nth-child(3) > visual-modern:nth-child(1) > div:nth-child(1) > svg:nth-child(2) > g:nth-child(1) > text:nth-child(1) > tspan:nth-child(1)"
                                             ).text.replace(",", ""))
print(str(NV))
total += NV
int2File(NV, "NV")

#New hampshire
driver.get("https://www.nh.gov/covid19/")
NH = int(driver.find_element_by_css_selector(".summary-list > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)"
                                              ).text.replace(",", ""))
print(str(NH))
total += NH
int2File(NH, "NH")

#New Jersey (Make sure you fill up your gas tank before you enter, because you cant pump your own gas!)
driver.get("https://www.nj.gov/health/")
while (len(driver.find_elements_by_css_selector("div.slick-slide:nth-child(5) > div:nth-child(1) > div:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > strong:nth-child(1)")) == 0):
    time.sleep(.1)
NJ = int(driver.find_element_by_css_selector("div.slick-slide:nth-child(5) > div:nth-child(1) > div:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > strong:nth-child(1)"
                                             ).text.replace(",", ""))
print(str(NJ))
total += NJ
int2File(NJ, "NJ")

#New mexico (wallless, for now)
driver.get("https://cv.nmhealth.org/")
while (len(driver.find_elements_by_css_selector("h2.et_pb_module_header > span:nth-child(1)")) == 0):
    time.sleep(.1)
NM = int(driver.find_element_by_css_selector("h2.et_pb_module_header > span:nth-child(1)").text.replace(",", ""))
print(str(NM))
total += NM
int2File(NM, "NM")

#New York
driver.get("https://coronavirus.health.ny.gov/county-county-breakdown-positive-cases")
NY = int(driver.find_element_by_css_selector(".nothead > tbody:nth-child(1) > tr:nth-child(51) > td:nth-child(2) > b:nth-child(1)"
                                      ).text.replace(",", ""))
print(str(NY))
total += NY
int2File(NY, "NY")

#North Carolina
driver.get("https://www.ncdhhs.gov/covid-19-case-count-nc")
NC = int(driver.find_element_by_xpath("/html/body/div[2]/div/div[2]/main/article/div/div[2]/div/div/div/div/div/div/div/div[1]/section/section/div/div/div/table/tbody/tr[2]/td[1]/h3"
                                      ).text.replace(",", ""))
print(str(NC))
total += NC
int2File(NC, "NC")

#North Dakota (above south dakota #southdakotagang)
#Just photos (WTFFFF)

#Ohio
driver.get("https://coronavirus.ohio.gov/wps/portal/gov/covid-19/")
OH = int(driver.find_element_by_css_selector("div.odh-ads__item:nth-child(1) > div:nth-child(1) > div:nth-child(1)").text.replace(",", ""))
print(str(OH))
total += OH
int2File(OH, "OH")

#Oklahoma (It's NOT OK)
driver.get("https://coronavirus.health.ok.gov/")
OK = int(driver.find_element_by_xpath("/html/body/div[2]/main/div/div/div[5]/div[1]/div/div[5]/div/table[4]/tbody/tr[18]/td[2]"
                                      ).text.replace(",", ""))
print(str(OK))
total += OK
int2File(OK, "OK")

#Oregon
driver.get("https://govstatus.egov.com/OR-OHA-COVID-19")
OR = int(driver.find_element_by_css_selector(".table-warning > b:nth-child(1)"
                                              ).text.replace(",", ""))
print(str(OR))
total += OR
int2File(OR, "OR")

#Pennsylvania
driver.get("https://www.health.pa.gov/topics/disease/coronavirus/Pages/Cases.aspx")
PA = int(driver.find_element_by_xpath("/html/body/form/div/div[2]/div/div[4]/div[5]/div/div/div/div/div[1]/div/div/div[2]/div/div/div/div[2]/div/div[2]/table/tbody/tr[2]/td[2]"
                                      ).text.replace(",", ""))
print(str(PA))
total += PA
int2File(PA, "PA")

#Rhode Island (not an island #mindblown)
driver.get("https://health.ri.gov/data/covid-19/")
while (len((driver.find_elements_by_xpath("/html/body/div[4]/div[1]/div[2]/div/div/div[2]/div/div/table/tbody/tr[4]/td[2]"))) == 0):
    time.sleep(.1)
RI = int(driver.find_element_by_xpath("/html/body/div[4]/div[1]/div[2]/div/div/div[2]/div/div/table/tbody/tr[4]/td[2]"
                                      ).text.replace(",", ""))
print(str(RI))
total += RI
int2File(RI, "RI")

#Wisconsin
driver.get("https: // www.dhs.wisconsin.gov/outbreaks/index.htm")
WI = int(driver.find_element_by_xpath("//*[@id='covid-county-table']/table/tbody/tr[31]/td[2]/strong"
                                      ).text.replace(",", ""))
print(str(WI))
total += WI
int2File(WI, "WI")

#Wyoming (since when do dead bushes get corona)
driver.get("https://health.wyo.gov/publichealth/infectious-disease-epidemiology-unit/disease/novel-coronavirus/")
WY = int(driver.find_element_by_xpath("//*[@id='et-boc']/div/div/div/div[3]/div[1]/div/div/p[2]/strong"
                                      ).text.replace(",", ""))
print(str(WY))
total += WY
int2File(WY, "WY")

#Output Handling
#store = gc.open_by_url('https://docs.google.com/spreadsheets/d/19PpoExlTc7I4V-HpxvrqDGDrKuRND10Hm3hA_pJvnjw/edit?usp=sharing').sheet2
#total = store.range('F1:F52')
print("total: " + str(total))
#worksheet.update_cells(total)
