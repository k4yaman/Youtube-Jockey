#!/bin/bash
mm="$(date +'%m')"
yyyy="$(date +'%Y')"
yearCnt=`expr $yyyy - 2008`
start=$SECONDS

if [ "$1" == "--all" ] || [ "$1" == "-a" ]; then
	for i in $(seq 0 $yearCnt)
	do
		year=`expr $yyyy - $yearCnt + $i`
		month="1"
		monthCnt="1"
		while [ $month -lt 13 ]
		do
        	if [ $i -eq 0 ] && [ $month -lt 12 ]; then
        		month=$[$month+1]
        		continue
        	fi

			printf "Exec import for: %s/%s\n" "$year" "$month"
			node importWimp.js $year $month

        	if [ $i -eq $yearCnt ] && [ "$month" -gt `expr $mm - 1` ]; then
        		break
        	fi
			month=$[$month+1]
		done
	done
elif [ "$1" == "--current" ] || [ "$1" == "-c" ]; then
	printf "Exec import for: %s/%s\n" "$yyyy" "$mm"
	node importWimp.js $yyyy $mm
else 
	printf "no Arguments: shows this help\n--all (-a):        execute all Months starting from 2008 12\n--current (-c):    starts import current month\n"
fi

duration=$(( SECONDS - start ))
printf "Overall Statistics:\n"
printf "Duration (mm:ss)-> %02d:%02d\n" "$((duration/60%60))" "$((duration%60))"
