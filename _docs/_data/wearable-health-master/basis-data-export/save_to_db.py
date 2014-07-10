#!/usr/bin/python


import os
import json
from pprint import pprint
import time


#Server Connection to MySQL:
import MySQLdb
conn = MySQLdb.connect(host= "localhost",
                  user="shaun",
                  passwd="ischool",
                  db="shaun")
x = conn.cursor()


def main():
	cur_dir = "./data"
	for file in os.listdir(cur_dir):
	    if file.endswith(".json"):
	        with open(cur_dir + '/' + file) as data_file:
	    		data = json.load(data_file)
	    	if data['bodystates']:
	    		print "importing: ", file
	    		json_to_db(data, 1)
	    		#print data['starttime']
	    		#print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(data['starttime']))
	    		
	    	else:
	    		#print "null file: ", file
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
		sql = "INSERT INTO `wh_d_basis` (`u_id`,`date_epoch`,`date_human`,`air_temp`,`calories`,`gsr`,`heartrate`,`skin_temp`,`steps`) VALUES (" + str(user_id) + ",'" + date_epoch + "','" + date_human + "'," + values + ")";
		#print sql
		try:
		   x.execute(sql)
		   conn.commit()
		except:
		   conn.rollback()

	return

if __name__ == "__main__":
    main()

    conn.close()

