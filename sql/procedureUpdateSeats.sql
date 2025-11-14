SET GLOBAL event_scheduler = ON;
DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_available_seats`(IN `id` INT, IN `quantity` INT, IN `operation` VARCHAR(10))
BEGIN
    IF operation = 'INSERT' THEN
        UPDATE `event`
        SET event_seats = event_seats - quantity
        WHERE event_id = id;
    ELSEIF operation = 'CANCEL' THEN
        UPDATE `event`
        SET event_seats = event_seats + quantity
        WHERE event_id = id;
    END IF;
END$$

DELIMITER ;