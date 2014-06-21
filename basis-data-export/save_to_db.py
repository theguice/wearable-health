#!/usr/bin/python

#Server Connection to MySQL:

import MySQLdb
conn = MySQLdb.connect(host= "ischool.berkeley.edu",
                  user="shaun",
                  passwd="ischool",
                  db="shaun")
x = conn.cursor()

try:
   x.execute("""INSERT INTO anooog1 VALUES (%s,%s)""",(188,90))
   conn.commit()
except:
   conn.rollback()

conn.close()