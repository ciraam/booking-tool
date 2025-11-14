SET GLOBAL event_scheduler = ON;
DELIMITER $$

CREATE EVENT update_past_bookings
ON SCHEDULE EVERY 1 DAY
STARTS '2025-10-30 00:00:00'
DO
BEGIN
    UPDATE booking AS b
    JOIN event AS e ON b.booking_event_id = e.event_id
    SET b.booking_status = 'past'
    WHERE e.event_date < NOW()
      AND b.booking_status != 'past';
END$$

DELIMITER ;
