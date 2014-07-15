#!/usr/bin/python

import os
import json
from pprint import pprint
import time
from subprocess import call
import datetime


#Server Connection to MySQL:
import MySQLdb
conn = MySQLdb.connect(host=   "localhost",
                       user=   "shaun",
                       passwd= "ischool",
                       db=     "shaun")
x = conn.cursor()

#31,625
#28799

def main():
    cur = conn.cursor()
    cur.execute("SELECT u_id,begin_date,basis_u,basis_p,lumo_api,moves_u,moves_p FROM `wh_users`")
    for (u_id,begin_date,basis_u,basis_p,lumo_api,moves_u,moves_p) in cur:
        print u_id,begin_date,basis_u,basis_p,lumo_api,moves_u,moves_p
        '''
        ##### SYNC DATA FROM BASIS CLOUD #####
        if (begin_date and basis_u and basis_p):
            print "Syncing data for user: " + str(u_id)
            download_basis_json(u_id)
            collect_basis_json(u_id)
        else:
            print "Sync failed for user:" + str(u_id) + " - reason: basis credentials missing or begin_date missing"
        '''
        if (lumo_api):
            download_lumo(u_id, lumo_api)

def download_lumo(user_id, lumo_api):
    print "Downloading Lumo data for user: " + str(user_id)
    print lumo_api
    

def download_basis_json(user_id):
    # get user start date string

    cur = conn.cursor()
    cur.execute("SELECT begin_date,basis_u,basis_p FROM `wh_users` WHERE u_id=" + str(user_id))
    user_details = cur.fetchone()
    sdate = user_details[0].split('-')
    date = datetime.datetime(int(sdate[0]),int(sdate[1]),int(sdate[2]))
    for i in range(30): 
	curdate = date.strftime('%Y-%m-%d')
	print "\tDownload from Basis: " + str(curdate)
	cmd = "php ./basis_data_export/basisdataexport.php -u" + user_details[1] + " -p" + user_details[2] + " -fjson -d" + curdate
	call(cmd, shell=True)
        date += datetime.timedelta(days=1)


def collect_basis_json(user_id):
	cur_dir = "./basis_data_export/data_basis"
	for file in os.listdir(cur_dir):
	    if file.endswith(".json"):
	        with open(cur_dir + '/' + file) as data_file:
	    		data = json.load(data_file)
	    	if data['bodystates']:
	    		print "\tImporting to database: ", file
	    		json_to_db(data, user_id)
	    		#print data['starttime']
	    		#print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(data['starttime']))
	    		
	    	else:
	    		continue

#translate json file to mysql statements
def json_to_db(d, user_id):
	keys = ['air_temp','calories','gsr','heartrate','skin_temp','steps']
	for i in range (0, 1440):
		values = ''
		for k in keys:
			values += "'" + str(d['metrics'][k]['values'][i]) + "'"
			if not k == 'steps':
				values += ','
			date_human = str(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(d['starttime'] + (i * 60))))
			date_epoch = str(d['starttime'] + (i * 60))
                cur = conn.cursor()
                cur.execute("SELECT u_id,date_epoch FROM `wh_d_basis` WHERE `u_id`=" + str(user_id) + " AND `date_epoch`=" + date_epoch)
                duplicate_check = cur.fetchone()

                if not duplicate_check:
                    sql = "INSERT INTO `wh_d_basis` (`u_id`,`date_epoch`,`date_human`,`air_temp`,`calories`,`gsr`,`heartrate`,`skin_temp`,`steps`) VALUES (" + str(user_id) + ",'" + date_epoch + "','" + date_human + "'," + values + ")";
                    try:
                        x.execute(sql)
                        conn.commit()
                    except:
                        conn.rollback()
	return

if __name__ == "__main__":
    main()
    conn.close()

