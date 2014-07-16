#!/usr/bin/python

import json, datetime
#import wget

#url = 
#lumo = wget.download(url)

f = open('moves_export/json/full/activities.json', 'r')
moves = json.loads(f.read())

#print moves
user_id = 0

for m in moves:
    #print "\n-----------------\n", m["date"], "\n\tSEGMENTS"
    if (m["segments"]):
        for s in m["segments"]:
            for a in s["activities"]:
                continue
                #print "\t", user_id, a['startTime'], a['endTime'], s['type'], a['activity'], a['duration'], a['distance'], a['group'], a['manual']
                #if ( exists a['steps']):
                #    print a['steps']
            
f = open('moves_export/json/full/places.json', 'r')
moves = json.loads(f.read())

for m in moves:
    #print "\n-----------------\n", m["date"], "\tSEGMENTS"
    if (m["segments"]):
        for s in m["segments"]:
            continue
            #print "\t", user_id, s['startTime'], s['endTime'], s['type'], s['place']['id'], s['place']['location']['lat'], s['place']['location']['lon']
            # u_id , type , startTime , endTime , place_id , place_name , lat , lon

f = open('moves_export/json/full/storyline.json', 'r')
moves = json.loads(f.read())

for m in moves:
    #print "\n-----------------\n", m["date"], "\n\tSEGMENTS"
    if (m["segments"]):
        for s in m["segments"]:
            '''
            #print "\t", user_id, s['startTime'], s['endTime'], s['type'], 
            if (s['type'] == "place"):
                print s['place']['id'], s['place']['location']['lat'], s['place']['location']['lon'],
            else:
                print "", "", "",
            print s['activities']['activity'], s['activities']['startTime'], s['activities']['endTime'], s['activities']['duration'], s['activities']['distance'], s['activities'],
            #if exists s['activities']['steps']:
            #    print s['activities']['steps']
            '''
            #if not empty(s['activities']['trackPoints']):
            
            if 'activities' in s.keys():
                for a in s['activities']:
                    if a['trackPoints']:
                        for t in a['trackPoints']:
                            print user_id, t['time'], t['lat'], t['lon']

            
            #s['place']['location']['lat'], s['place']['location']['lon']
    
'''
# Moves_ACTIVITIES  --  DB Table format
# u_id , start_time , end_time , type , activity , duration , distance , group , manual, (steps)
# Moves_PLACES      --  DB Table format
# u_id , start_time , end_time , type , place_id , lat , lon

# Moves_TRACKPOINTS      --  DB Table format
# u_id , time, lat, lon


'''






4 , 9 , 6 












