#!/bin/bash
currentDateTs=$(date -j -f "%Y-%m-%d" $1 "+%s")
endDateTs=$(date -j -f "%Y-%m-%d" $2 "+%s")
offset=86400

php=`which php`

while [ "$currentDateTs" -le "$endDateTs" ]
do
  date=$(date -j -f "%s" $currentDateTs "+%Y-%m-%d")
  echo $date
  $php basisdataexport.php -ushaun@ischool.berkeley.edu -pflowers4Basis -fjson -d$date
  currentDateTs=$(($currentDateTs+$offset))
done

#php basisdataexport.php -ushaun@ischool.berkeley.edu -pflowers4Basis -d2014-06-06 -fjson