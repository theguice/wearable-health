#!/bin/bash
currentdate=$1
loopenddate=$(/bin/date --date "$2 1 day" +%Y-%m-%d)

until [ "$currentdate" == "$loopenddate" ]
do
  echo "Exporting Basis Data for: " $currentdate
  /usr/bin/php ./basisdataexport.php -ushaun@ischool.berkeley.edu -pflowers4Basis -fjson -d$currentdate
  currentdate=$(/bin/date --date "$currentdate 1 day" +%Y-%m-%d)
done

/usr/bin/python ./save_to_db.py