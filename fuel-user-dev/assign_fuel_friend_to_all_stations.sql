-- Assign fuel friend d6cac9d0-0c25-493b-865a-94e413b95775 to all fuel stations
INSERT INTO station_fuel_friends (station_id, fuel_friend_id, is_active)
SELECT 
    fs.id as station_id,
    'd6cac9d0-0c25-493b-865a-94e413b95775' as fuel_friend_id,
    true as is_active
FROM fuel_stations fs
WHERE NOT EXISTS (
    SELECT 1 FROM station_fuel_friends sff 
    WHERE sff.station_id = fs.id 
    AND sff.fuel_friend_id = 'd6cac9d0-0c25-493b-865a-94e413b95775'
);