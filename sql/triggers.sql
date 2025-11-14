SET GLOBAL event_scheduler = ON;
DELIMITER $$

CREATE DEFINER=`root`@`localhost` EVENT `update_past_bookings` ON SCHEDULE EVERY 1 DAY STARTS '2025-10-30 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
UPDATE booking as b
  JOIN event e ON b.booking_event_id = e.event_id
  SET b.booking_status = 'past'
  WHERE e.event_date < NOW()
    AND b.booking_status != 'past';
END

CREATE TRIGGER `trg_after_update_booking` AFTER UPDATE ON `booking`
 FOR EACH ROW BEGIN
    IF NEW.booking_status = 'cancelled' AND OLD.booking_status != 'cancelled' THEN
        CALL update_available_seats(OLD.booking_event_id, OLD.booking_quantity, 'CANCEL');
    END IF;
END$$

DELIMITER ;