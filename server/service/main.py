#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Sep 30 22:01:08 2022

@author: stavros
"""


import obspy

from obspy.core import read
from obspy.core import UTCDateTime


def exampleReadSTation():
    station = "https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_pse/data/xa/metadata/stationxml.xa.0.sxml"
    inv = obspy.read_inventory(station)
    print(inv)
    
    ch = inv.select(channel="*MH1")
    print(ch)

    
    lst = inv.get_contents()
    print(lst)
    
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
    
    
    a = 'https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_pse/data/xa/continuous_waveform/s11/1969/202/xa.s11..att.1969.202.0.mseed'
    s = read(a)
    s.plot()
    return



def main():
    print("Next line should print 2012-09-07T12:15:00.000000Z")
    print(UTCDateTime("2012-09-07T12:15:00"))
    #exampleReadSTation()

if __name__ == "__main__":
    main()