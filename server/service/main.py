#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Sep 30 22:01:08 2022

@author: stavros
"""


import obspy

from obspy.core import read
from obspy.core import UTCDateTime



def main():
    print("Next line should print 2012-09-07T12:15:00.000000Z")
    print(UTCDateTime("2012-09-07T12:15:00"))

if __name__ == "__main__":
    main()