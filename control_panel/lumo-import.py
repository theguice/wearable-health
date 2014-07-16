#!/usr/bin/python

import json, datetime
#import wget

#url = 
#lumo = wget.download(url)

f = open('lumo-latest.json', 'r')
lumo = json.loads(f.read())

user_id = 0

#lumo_codes = []
cur_time = 0
for l in lumo['acts']:
    
    if (cur_time != l['t']):
        cur_time = l['t']
    t_human = datetime.datetime.utcfromtimestamp(l['t'])
        #print "-----------------------"
    
    '''
    if (l['act'] not in lumo_codes):
        lumo_codes.append(l['act'])
        print lumo_codes
    '''
    #print l
    
    # Lumo DB Table format
    # u_id , date_epoch , date_human , pct , act , delta    
    # Import this to database
    print user_id, l['t'], t_human, l['pct'], l['act'], l['delta']


    
# Lumo Codes
# [u'STG', u'SBF', u'C_WCALS', u'D_STBS_3', u'C_CALS', u'D_STBF_3', u'D_SBF_3', u'C_STEPS', u'W', u'STBF', u'SBS', u'D_STBS_2', u'D_SBS_3', u'STBS', u'D_SBS_2', u'D_SBF_2', u'D_STBF_2', u'C_STU', u'SG', u'C_DIST', u'LF', u'LR', u'STBL', u'STBR', u'SBL', u'C_RCALS', u'R', u'C_RDIST', u'C_RSTEPS', u'LB', u'SBR', u'C', u'LL', u'NW', u'INACT']

