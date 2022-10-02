#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Sep 30 22:01:08 2022

@author: stavros
"""

import math
import obspy
import json, base64

from obspy.core import read
from obspy.core import UTCDateTime


StationsLbl = {
 "S11": 'XA.S11 (ALSEP 11, Mare Tranquillitatis, Moon)', 
 "S12": 'XA.S12 (ALSEP 12, Oceanus Procellarum, Moon)', 
 "S14": 'XA.S14 (ALSEP 14, Fra Mauro, Moon)', 
 "S15": 'XA.S15 (ALSEP 15, Hadley Rille, Moon)', 
 "S16": 'XA.S16 (ALSEP 16, Descartes, Moon)'
 }


KnownStations = ["S11", "S12", "S14", "S15", "S16"]
KnownChannels = ["MH1", "MH2", "MHZ", "ATT"]

NasaMoonStationXML = "https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_pse/data/xa/metadata/stationxml.xa.0.sxml"

NasaMoonInventory = obspy.read_inventory(NasaMoonStationXML)


NasaSeismoDataPath = "https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_pse/data/xa/continuous_waveform/"
Example = 'xa.s12.01.mhz.1976.061.0.mseed'
Ex = 'https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_pse/data/xa/continuous_waveform/s12/1976/061/xa.s12.01.mhz.1976.061.0.mseed'


def TryCreateNasaUrl(Station, Loc, Channel, Date):
    sid = Station.lower()
    fname = 'xa.' + sid +'.'+ Loc+'.'+ Channel.lower() +'.' + str(Date.year) +'.' + str(dateToDayOfYear(Date)).zfill(3) +'.0.mseed'
    url = NasaSeismoDataPath + sid + dateToNasaUrl(Date) + fname
    return url

def createNasaUrl(entry, Date):
    return TryCreateNasaUrl(entry['station'], entry['location'], entry['channel'], Date)

def dateToDayOfYear(Date):
    #print(Date.year)
    start = UTCDateTime(year=Date.year, month=1, day=1, strict=False)
    #print(start)
    days = daysInRage(start, Date)
    return int(days)

def daysInRage(Start, End):
    diff = End - Start
    secInDay = 86400.0
    days = diff/secInDay
    return int(math.ceil(days))

def dateOffset(Start, DaysOffset):
    secInDay = 86400.0
    date = Start + secInDay*DaysOffset
    return date

def dateToNasaUrl(Date):
    addr = '/' + str(Date.year) + '/' + str(dateToDayOfYear(Date)).zfill(3) +'/'
    return addr

def SlpitByNasaNamingConvention(FullChannelName):
    tokens = FullChannelName.split('.')
    Net = tokens[0]
    Station = tokens[1]
    Loc = tokens[2]
    Chan = tokens[3]
    return Net, Station, Loc, Chan

def GetStationFromInv(inv, Station):
    tmp = inv.select(station=Station)
    
    return tmp[0][0]

def GetChannelFromInv(inv, Channel):
    tmp = inv.select(channel=Channel)
    return tmp[0][0][0]

def getAllStationsAndChannels(inv):
    lst = inv.get_contents()
    FullChan = lst['channels']
    
    Lst = []

    
    for chan in FullChan:
        Net, St, Loc, Chan = SlpitByNasaNamingConvention(chan)
        
        Unq = {"network":Net, "station":St, "location":Loc, "channel":Chan}
        Lst.append(Unq)
        
        if St.lower() == 's12' and Chan == "SHZ":
            c = GetChannelFromInv(inv, Chan)
            print(c)
            
    
    return Lst


def ShowStationData(inv, Station, Channel=None, Date = None, Outfile=None, JsonList=False):
    
    tmp = inv.select(station=Station)
    lst = getAllStationsAndChannels(tmp)
    #print(lst)
    JList = []
    
    for entry in lst:
        
        
        if Channel and entry['channel'].lower() != Channel.lower():
            continue
        #print(entry)
        St = GetStationFromInv(inv, entry['station'])
        
        date = Date
        if not Date:
            d = UTCDateTime(St.start_date)
            date = dateOffset(d, 10)
            
        u = createNasaUrl(entry, date)
        
        a = obspy.Stream()
        Found = False
        try:
            a = read(u)
            Found = True
        except:
           print("Error! Data were not found in")
           print(u)
         
        if not Found:
            continue
       
        
        if Outfile:
            f = str(Outfile+"/" + entry['station'] + "_" + entry['channel']+'.svg')
            a.plot(outfile=f)
            
            if JsonList:
                with open(f, 'rb') as img:
                    data = img.read()
                    #imgdata = base64.b64encode(data)
                    imgdata = data
                    s = entry['station']
                    record = {
                        'date': str(date),
                        'channelName': entry['channel'],
                        'stationName':  StationsLbl[s.upper()],
                        'stationDescription' : str(St),
                        'image':str(imgdata)
                        }
                    JList.append(record)
        else:
            a.plot()
    
    if JsonList:
        return JList
    return None

def ShowStationDataTest(Station, Channel=None, Date = None, Outfile=None):
    ShowStationData(NasaMoonInventory, Station, Channel=None, Date = None, Outfile=None)
    return

def exampleReadSTation():
    station = NasaMoonStationXML
    inv = NasaMoonInventory #obspy.read_inventory(station)

    st = GetStationFromInv(inv, "S12")
    daysInRage(st.start_date, st.end_date)
    dateOffset(st.start_date, 10)
    doy = dateToDayOfYear(st.start_date)
    u = dateToNasaUrl(st.start_date)
    url = TryCreateNasaUrl(st, st.start_date, "MH1")
    print(doy, u)
    print(url)
    return
    
    print(st.code,st.creation_date, st.termination_date)
    print(st.external_references, st.source_id)
    return
           
    
    print(inv)
    
    ch = inv.select(channel="*MH1")
    print(ch)
  
    
    net = inv[0]
    print(net)
    
    st = net[0]
    print(st)
    
    ch = st[0]
    print(ch)
    
    print(ch.source_id)
   # ch.plot(0.001)
    
    #stat = inv.select(station="XA.S15*", channel="*.MH1", network="XA")
    #print(stat, inv)
    

    return




def main():
    print("Next line should print 2012-09-07T12:15:00.000000Z")
    print(UTCDateTime("2012-09-07T12:15:00"))
    return
    
  
    
    JList = []
    JList1 = ShowStationData(NasaMoonInventory, "S11", Outfile="/home/stavros/Repos/", JsonList = True)
    JList2 = ShowStationData(NasaMoonInventory, "S12", Outfile="/home/stavros/Repos/", JsonList = True)
    JList3 = ShowStationData(NasaMoonInventory, "S14", Outfile="/home/stavros/Repos/", JsonList = True)
    JList4 = ShowStationData(NasaMoonInventory, "S15", Outfile="/home/stavros/Repos/",  JsonList = True)
    JList5 = ShowStationData(NasaMoonInventory, "S16", Outfile="/home/stavros/Repos/",  JsonList = True)
    
    JList.extend(JList1)
    JList.extend(JList2)
    JList.extend(JList3)
    JList.extend(JList4)
    JList.extend(JList5)
    
    with open("/home/stavros/Repos/out.json", 'w') as f:
        json.dump(JList, f)
    #ShowStationData(NasaMoonInventory, "S15", Outfile="/home/stavros/Repos/")
    #ShowStationData(NasaMoonInventory, "S16", Outfile="/home/stavros/Repos/")

    #Stream = read(Ex)
    #Stream.plot()
    
    #exampleReadSTation()
    return

if __name__ == "__main__":
    main()