while true
do
    # Get the current timestamp
    TIMESTAMP=$(date +%s)

    # Name the files after the timestamp
    # FILENAME=$(printf '%s.gz' "$TIMESTAMP")
    FILENAME=$(printf '%s.json' "$TIMESTAMP")
    FILENAME_CSV=$(printf '%s.csv' "$TIMESTAMP")

    # Grab the data from the API and save it in the data hold folder
    # curl https://backend-unified.mylirr.org/locations/ -H 'Accept-Version: 3.0' -H 'Accept-Encoding: gzip, deflate' > data_hold/gzip/$FILENAME
    curl "https://backend-unified.mylirr.org/locations?geometry=NONE&railroad=BOTH" -H 'Accept-Version: 3.0' > data_hold/json/$FILENAME

    # Unzip the file
    # gzip -d data_hold/gzip/$FILENAME

    echo data_hold/json/$FILENAME

    # Convert the file into a csv
    cat data_hold/json/$FILENAME | in2csv -f json -v > data_hold/csv/$FILENAME_CSV

    # Wait one hour before running again
    echo "Now sleeping for 1 hour"
    sleep 3600
done
