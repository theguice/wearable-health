#!/usr/bin/python

import os
import json
from pprint import pprint
import time
from subprocess import call
import datetime
from datetime import date
import requests
from HTMLParser import HTMLParser
import uuid

# Server Connection to MySQL:
import MySQLdb

conn = MySQLdb.connect(host="localhost",
                       user="healthstudy",
                       passwd="jo9fog",
                       db="healthstudy")
# conn = MySQLdb.connect(host=   "127.0.0.1",
#                        user=   "root",
#                        passwd= "root",
#                        db=     "healthstudy")

x = conn.cursor()

#31,625
#28799

def main():
    cur = conn.cursor()
    cur.execute("SELECT u_id,begin_date,basis_u,basis_p,lumo_api,moves_u,moves_p FROM `wh_users`")
    for (u_id, begin_date, basis_u, basis_p, lumo_api, moves_u, moves_p) in cur:
        print u_id, begin_date, basis_u, basis_p, lumo_api, moves_u, moves_p
        if (begin_date):
            ##### SYNC DATA FROM BASIS CLOUD #####
            if (basis_u and basis_p):
                print "Syncing data for user: " + str(u_id)
                #download_basis_json(u_id)
                #collect_basis_json(u_id)
            else:
                print "Basis sync failed for user: " + str(u_id) + " - reason: basis credentials missing"
            ##### SYNC DATA FROM LUMO CLOUD #####
            if (lumo_api):
                #download_lumo(u_id, lumo_api, begin_date)
                print "download lumo stuff"
            else:
                print "Lumo sync failed for user: " + str(u_id) + " lumo_api string missing"
            ##### Parse Local Moves File ####
            import_moves(u_id)


        else:
            print "All syncing failed for user: " + str(u_id) + " begin_date missing"


def download_lumo(user_id, lumo_api, begin_date):
    print "Downloading Lumo data for user: " + str(user_id)

    # Create URL Params
    d = date_make(begin_date)
    from_t = date_to_epoch(d)
    # increment 30 days
    d += datetime.timedelta(days=30)
    to_t = date_to_epoch(d)
    lumo_api += "&from_t=" + str(from_t) + "&to_t=" + str(to_t)
    # http://my.lumoback.com/unuuencode?login=shaun@ischool.berkeley.edu&passwd=fbd5de23e2ee3be9b313e0e28f1560db&granularity=raw&from_t=1401778800&to_t=1404370800

    # Get data from LUMO API
    r = requests.get(lumo_api)
    #print r.status_code
    #print r.headers
    lumo = json.loads(r.content)

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

        # Lumo DB Table format
        # u_id , date_epoch , date_human , pct , act , delta    
        # Import this to database
        #print user_id, l['t'], t_human, l['pct'], l['act'], l['delta']
        lumo_to_db(user_id, l['t'], t_human, l['pct'], l['act'], l['delta'])

        ##### Lumo Codes #####
        # [u'STG', u'SBF', u'C_WCALS', u'D_STBS_3', u'C_CALS', u'D_STBF_3', u'D_SBF_3', u'C_STEPS', u'W', u'STBF', u'SBS', u'D_STBS_2', u'D_SBS_3', u'STBS', u'D_SBS_2', u'D_SBF_2', u'D_STBF_2', u'C_STU', u'SG', u'C_DIST', u'LF', u'LR', u'STBL', u'STBR', u'SBL', u'C_RCALS', u'R', u'C_RDIST', u'C_RSTEPS', u'LB', u'SBR', u'C', u'LL', u'NW', u'INACT']


def lumo_to_db(user_id, date_epoch, date_human, l_pct, l_act, l_delta):
    cur = conn.cursor()
    cur.execute("SELECT u_id,date_epoch FROM `wh_d_lumo` WHERE `u_id`=" + str(user_id) + " AND `date_epoch`=" + str(
        date_epoch) + " AND `act`='" + str(l_act) + "'")
    duplicate_check = cur.fetchone()

    if not duplicate_check:
        sql = "INSERT INTO `wh_d_lumo` (`u_id`,`date_epoch`,`date_human`,`pct`,`act`,`delta`) VALUES (" + str(
            user_id) + ",'" + str(date_epoch) + "','" + str(date_human) + "'," + str(l_pct) + ",'" + str(
            l_act) + "'," + str(l_delta) + ")";
        try:
            x.execute(sql)
            conn.commit()
        except:
            conn.rollback()
    return


def download_basis_json(user_id):
    # get user start date string

    cur = conn.cursor()
    cur.execute("SELECT begin_date,basis_u,basis_p FROM `wh_users` WHERE u_id=" + str(user_id))
    user_details = cur.fetchone()
    date = date_make(user_details[0])
    for i in range(30):#Shubham--> shaun: what this for, seems out of place?
        curdate = date.strftime('%Y-%m-%d')
        print "\tDownload from Basis: " + str(curdate)
        cmd = "php /groups/healthstudy/public_html.ssl/control_panel/basis_data_export/basisdataexport.php -u" + \
              user_details[1] + " -p" + user_details[2] + " -fjson -d" + curdate
        call(cmd, shell=True)
        date += datetime.timedelta(days=1)


def collect_basis_json(user_id):
    cur_dir = "/groups/healthstudy/public_html.ssl/control_panel/basis_data_export/data_basis"
    for file in os.listdir(cur_dir):
        if file.endswith(".json"):
            with open(cur_dir + '/' + file) as data_file:
                data = json.load(data_file)
                print file
            os.remove(cur_dir + '/' + file)
            if data['bodystates']:
                print "\tImporting to database: ", file
                json_to_db(data, user_id)
            #print data['starttime']
            #print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(data['starttime']))

            else:
                continue


#translate json file to mysql statements
def json_to_db(d, user_id):
    keys = ['air_temp', 'calories', 'gsr', 'heartrate', 'skin_temp', 'steps']
    number_of_entries = len(d['metrics']['air_temp']['values']) - 1
    for i in range(0, number_of_entries):
        values = ''
        for k in keys:
            values += "'" + str(d['metrics'][k]['values'][i]) + "'"
            if not k == 'steps':
                values += ','
            date_human = str(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(d['starttime'] + (i * 60))))
            date_epoch = str(d['starttime'] + (i * 60))
            cur = conn.cursor()
            cur.execute(
                "SELECT u_id,date_epoch FROM `wh_d_basis` WHERE `u_id`=" + str(user_id) + " AND `date_epoch`=" + date_epoch)
            duplicate_check = cur.fetchone()

            if not duplicate_check:
                sql = "INSERT INTO `wh_d_basis` (`u_id`,`date_epoch`,`date_human`,`air_temp`,`calories`,`gsr`,`heartrate`,`skin_temp`,`steps`) VALUES (" + str(
                    user_id) + ",'" + date_epoch + "','" + date_human + "'," + values + ")";
                try:
                    x.execute(sql)
                    conn.commit()
                except:
                    conn.rollback()
    return


def import_moves(user_id):
    try:
        f = open('/groups/healthstudy/public_html.ssl/uploads/moves_export_user_' + str(
            user_id) + '/json/full/activities.json', 'r')
    except:
        print "moves - no activities.json file for user: ", user_id
        return
    moves = json.loads(f.read())
    print "\tmoves - importing activities for user: ", user_id

    for m in moves:
        if (m["segments"]):
            for s in m["segments"]:
                for a in s["activities"]:
                    if 'steps' in a.keys():
                        steps = a['steps']
                    else:
                        steps = "None"

                    time_start = moves_date_to_epoch(a['startTime'])
                    time_end = moves_date_to_epoch(a['endTime'])

                    ##### WRITE TO DB #####
                    cur = conn.cursor()
                    cur.execute("SELECT u_id,time_start,time_end,act FROM `wh_d_moves_acts` WHERE `u_id`=" + str(
                        user_id) + " AND `time_start`='" + str(time_start) + "' AND `time_end`='" + str(
                        time_end) + "' AND `act`='" + str(a['activity']) + "'")
                    duplicate_check = cur.fetchone()
                    if not duplicate_check:
                        sql = "INSERT INTO `wh_d_moves_acts` (`u_id`,`time_start`,`time_end`,`type`,`act`,`duration`, `distance`, `steps`) VALUES (" + str(
                            user_id) + ",'" + str(time_start) + "','" + str(time_end) + "','" + str(
                            s['type']) + "','" + str(a['activity']) + "','" + str(a['duration']) + "','" + str(
                            a['distance']) + "','" + str(steps) + "')";
                        try:
                            x.execute(sql)
                            conn.commit()
                        except:
                            conn.rollback()
                            ##### WRITE Finished #####

    try:
        f = open(
            '/groups/healthstudy/public_html.ssl/uploads/moves_export_user_' + str(user_id) + '/json/full/places.json',
            'r')
    except:
        print "moves - no places.json file for user: ", user_id
        return
    moves = json.loads(f.read())
    print "\tmoves - importing places for user: ", user_id

    for m in moves:
        if (m["segments"]):

            for s in m["segments"]:
                time_start = moves_date_to_epoch(s['startTime'])
                time_end = moves_date_to_epoch(s['endTime'])

                if 'name' in s['place'].keys():
                    name = s['place']['name']
                else:
                    name = "None"

                ##### WRITE TO DB #####
                cur = conn.cursor()
                cur.execute(
                    "SELECT u_id FROM `wh_d_moves_places` WHERE `u_id`=" + str(user_id) + " AND `time_start`='" + str(
                        time_start) + "' AND `time_end`='" + str(time_end) + "' AND `place_id`='" + str(
                        s['place']['id']) + "'")
                duplicate_check = cur.fetchone()
                if not duplicate_check:
                    print s['place']['location']['lat']
                    print s['place']['location']['lon']
                    sql = "INSERT INTO `wh_d_moves_places` (`u_id`,`time_start`,`time_end`,`type`,`place_id`,`name`,`lat`, `lon`) VALUES (" + str(
                        user_id) + ",'" + str(time_start) + "','" + str(time_end) + "','" + str(
                        s['type']) + "','" + str(s['place']['id']) + "','" + str(name) + "','" + str(
                        s['place']['location']['lat']).encode('utf8') + "','" + str(s['place']['location']['lon']).encode('utf8')+ "')";
                    try:
                        x.execute(sql)
                        conn.commit()
                    except:
                        conn.rollback()
                        ##### WRITE Finished #####

    try:
        f = open('/groups/healthstudy/public_html.ssl/uploads/moves_export_user_' + str(
            user_id) + '/json/full/storyline.json', 'r')
    except:
        print "moves - no storyline.json file for user: ", user_id
        return
    moves = json.loads(f.read())
    print "moves - importing trackpoints for user: ", user_id

    for m in moves:
        if (m["segments"]):
            for s in m["segments"]:
                if 'activities' in s.keys():
                    for a in s['activities']:
                        activity_type = a['activity']
                        if a['trackPoints']:
                            path_unique_id = uuid.uuid4()
                            for t in a['trackPoints']:
                                time = moves_date_to_epoch(t['time'])
                                ##### WRITE TO DB #####
                                cur = conn.cursor()
                                cur.execute("SELECT u_id FROM `wh_d_moves_trackpoints` WHERE `u_id`=" + str(
                                    user_id) + " AND `time`='" + str(time) + "' AND `lat`='" + str(
                                    t['lat']) + "' AND `lon`='" + str(t['lon']) + "'")
                                duplicate_check = cur.fetchone()
                                if not duplicate_check:
                                    sql = "INSERT INTO `wh_d_moves_trackpoints` (`u_id`,`time`,`lat`, `lon`, `path_id`, `activity_type`) VALUES (" + str(
                                        user_id) + ",'" + str(time) + "','" + str(t['lat']) + "','" + str(
                                        t['lon']) + "','" + str(path_unique_id) + "','" + str(activity_type)+ "')";
                                    try:
                                        x.execute(sql)
                                        conn.commit()
                                    except:
                                        conn.rollback()
                                        ##### WRITE Finished #####


def moves_date_to_epoch(t):
    t = t.replace('T', '').replace('-0700', '')
    t = datetime.datetime.strptime(t, "%Y%m%d%H%M%S")
    return date_to_epoch(t)


def date_make(datestr):
    sdate = datestr.split('-')
    date = datetime.datetime(int(sdate[0]), int(sdate[1]), int(sdate[2]))
    return date


def date_to_epoch(d):
    return int(d.strftime("%s"))


if __name__ == "__main__":
    main()
    conn.close()


