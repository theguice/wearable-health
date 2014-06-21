#!/bin/bash
currentdate=$1
loopenddate=$(/bin/date --date "$2 1 day" +%Y-%m-%d)

until [ "$currentdate" == "$loopenddate" ]
do
  echo $currentdate
  /usr/bin/php /home/guice/devel/wearable-health/basis-data-export/basisdataexport.php -ushaun@ischool.berkeley.edu -pflowers4Basis -fjson -d$currentdate
  currentdate=$(/bin/date --date "$currentdate 1 day" +%Y-%m-%d)
done
