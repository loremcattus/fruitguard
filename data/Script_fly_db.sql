-- Active: 1654821039392@@127.0.0.1@3306@fly_db
-- -----------------------------------------------------
-- DATABASE fly_db
-- -----------------------------------------------------
DROP DATABASE IF EXISTS `fly_db` ;

-- -----------------------------------------------------
-- DATABASE fly_db
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `fly_db` DEFAULT CHARACTER SET utf8 ;
USE `fly_db` ;

-- -----------------------------------------------------
-- Table `fly_db`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`role` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`role` (
  `role_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del rol',
  `role_name` VARCHAR(50) NOT NULL COMMENT 'nombre del rol',
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`user` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del usuario',
  `name` VARCHAR(100) NOT NULL COMMENT 'nombre del usuario',
  `email` VARCHAR(250) NOT NULL COMMENT 'correo electrónico del usuario',
  `password` VARCHAR(300) NOT NULL COMMENT 'contraseña del usuario',
  `has_license` TINYINT NOT NULL DEFAULT 0 COMMENT 'indica si tiene una licencia de conducir\npor defecto no tiene licencia',
  `active` TINYINT NOT NULL DEFAULT 1 COMMENT 'indica si el usuario esta habilitado en el sistema\npor defecto esta activo',
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'fecha de inserción del dato',
  `modifed_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'fecha de modificación del dato',
  `role_id` INT NOT NULL COMMENT 'identificador del rol del usuario',
  PRIMARY KEY (`user_id`),
  INDEX `fk_user_role1_idx` (`role_id` ASC),
  CONSTRAINT `fk_user_role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `fly_db`.`role` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `fly_db`.`map`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`map` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`map` (
  `map_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador y nombre del archivo asociado a la campaña',
  PRIMARY KEY (`map_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`campaign`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`campaign` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`campaign` (
  `campaign_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador de la campaña',
  `name` VARCHAR(50) NOT NULL COMMENT 'nombre de la campaña',
  `open` TINYINT NOT NULL DEFAULT 1 COMMENT 'indica si la campaña esta abierta o cerrada\nesta abierta por defecto',
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'fecha de inserción del dato',
  `modifed_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'fecha de modificación del dato',
  `commune` VARCHAR(50) NOT NULL COMMENT 'comuna a la que pertenece la campaña',
  `region` VARCHAR(75) NOT NULL COMMENT 'region a la que pertenece la comuna',
  `map_id` INT NULL COMMENT 'identificador del nombre del archivo que contiene la imagen del mapa asociado a la campaña',
  PRIMARY KEY (`campaign_id`),
  INDEX `fk_campaign_map1_idx` (`map_id` ASC),
  CONSTRAINT `fk_campaign_map1`
    FOREIGN KEY (`map_id`)
    REFERENCES `fly_db`.`map` (`map_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`block`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`block` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`block` (
  `block_id` INT NOT NULL COMMENT 'identificador de la manzana',
  `streets` VARCHAR(500) NOT NULL COMMENT 'calles que limitan la manzana',
  PRIMARY KEY (`block_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`area`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`area` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`area` (
  `area_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del area',
  `area` TINYINT(3) NOT NULL COMMENT 'area del foco, puede ser:\n200, 400, 800',
  PRIMARY KEY (`area_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`house`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`house` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`house` (
  `house_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador de la casa',
  `address` VARCHAR(100) NOT NULL COMMENT 'dirección de la casa',
  `block_id` INT NOT NULL COMMENT 'manzana de la casa',
  PRIMARY KEY (`house_id`),
  INDEX `fk_house_block1_idx` (`block_id` ASC) ,
  CONSTRAINT `fk_house_block1`
    FOREIGN KEY (`block_id`)
    REFERENCES `fly_db`.`block` (`block_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`state`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`state` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`state` (
  `state_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del estado',
  `state` VARCHAR(25) NOT NULL COMMENT 'nombre del estado, puede ser:\nse niega, sin moradores, abierta, cerrada',
  PRIMARY KEY (`state_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`focus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`focus` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`focus` (
  `focus_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del foco',
  `address` VARCHAR(100) NOT NULL COMMENT 'dirección del foco',
  `active` TINYINT NOT NULL DEFAULT 1 COMMENT 'indica si el foco esta esta activo, es decir, han pasado más de 3 meses desde el último avistamiento\npor defecto esta activo',
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'fecha de inserción del dato',
  `modifed_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'fecha de modificación del dato',
  `campaign_id` INT NOT NULL COMMENT 'identificador de la campaña asociada al foco',
  PRIMARY KEY (`focus_id`),
  INDEX `fk_focus_campaign1_idx` (`campaign_id` ASC) ,
  CONSTRAINT `fk_focus_campaign1`
    FOREIGN KEY (`campaign_id`)
    REFERENCES `fly_db`.`campaign` (`campaign_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`block_registration`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`block_registration` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`block_registration` (
  `block_registration_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del registro de la manzana',
  `block_id` INT NOT NULL COMMENT 'manzana en la que se basa el registro',
  `campaign_id` INT NOT NULL COMMENT 'campaña en que se realiza el registro de la manzana',
  PRIMARY KEY (`block_registration_id`),
  INDEX `fk_block_has_campaign_campaign1_idx` (`campaign_id` ASC) ,
  INDEX `fk_block_has_campaign_block1_idx` (`block_id` ASC) ,
  CONSTRAINT `fk_block_has_campaign_block1`
    FOREIGN KEY (`block_id`)
    REFERENCES `fly_db`.`block` (`block_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_block_has_campaign_campaign1`
    FOREIGN KEY (`campaign_id`)
    REFERENCES `fly_db`.`campaign` (`campaign_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`car`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`car` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`car` (
  `car_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del auto',
  `patent` VARCHAR(6) NOT NULL COMMENT 'patente del auto',
  `capacity` TINYINT(2) NOT NULL DEFAULT 2 COMMENT 'capacidad de personas que caben en el auto\npor defecto caben 2 personas',
  `available` TINYINT NOT NULL DEFAULT 1 COMMENT 'indica si el auto esta funcional y habilitado para asignarse a algún equipo\npor defecto esta disponible para su uso',
  UNIQUE INDEX `patent_UNIQUE` (`patent` ASC) ,
  PRIMARY KEY (`car_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`team`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`team` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`team` (
  `team_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del equipo',
  `tasks` VARCHAR(100) NOT NULL COMMENT 'manzanas registradas que debe muestrear el equipo',
  `users` VARCHAR(100) NOT NULL COMMENT 'usuarios/prospectores registrados que pertenecen al equipo',
  `campaign_id` INT NOT NULL COMMENT 'identificador de la campaña en la que se registra el equipo',
  `car_id` INT NOT NULL COMMENT 'identificador del auto que utilizará el equipo para llevar a cabo sus tareas',
  PRIMARY KEY (`team_id`),
  INDEX `fk_team_campaign1_idx` (`campaign_id` ASC) ,
  INDEX `fk_team_car1_idx` (`car_id` ASC) ,
  CONSTRAINT `fk_team_campaign1`
    FOREIGN KEY (`campaign_id`)
    REFERENCES `fly_db`.`campaign` (`campaign_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_team_car1`
    FOREIGN KEY (`car_id`)
    REFERENCES `fly_db`.`car` (`car_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`house_registration`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`house_registration` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`house_registration` (
  `house_registration_id` INT NOT NULL AUTO_INCREMENT COMMENT 'id del registro de la casa',
  `registration` DATETIME NOT NULL COMMENT 'fecha y hora en que se registro la casa',
  `grid` INT NOT NULL COMMENT 'sector de la grilla en que se encuentra',
  `comment` VARCHAR(500) NULL COMMENT 'comentario opcional asociado al registro de la casa',
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'fecha de inserción del dato',
  `modifed_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'fecha de modificación del dato',
  `area_id` INT NOT NULL COMMENT 'area en que se encuentra',
  `state_id` INT NOT NULL COMMENT 'estado de la casa',
  `focus_id` INT NOT NULL COMMENT 'foco en que se registro la casa',
  `house_id` INT NOT NULL COMMENT 'casa en que se basa el registro',
  `block_registration_id` INT NOT NULL COMMENT 'registro de manzana a la que pertenece el registro de la casa',
  `team_id` INT NOT NULL COMMENT 'equipo que registro la casa',
  PRIMARY KEY (`house_registration_id`),
  INDEX `fk_house_has_area_area1_idx` (`area_id` ASC) ,
  INDEX `fk_house_registration_state1_idx` (`state_id` ASC) ,
  INDEX `fk_house_registration_focus1_idx` (`focus_id` ASC) ,
  INDEX `fk_house_registration_house1_idx` (`house_id` ASC) ,
  INDEX `fk_house_registration_block_registration1_idx` (`block_registration_id` ASC) ,
  INDEX `fk_house_registration_team1_idx` (`team_id` ASC) ,
  CONSTRAINT `fk_house_has_area_area1`
    FOREIGN KEY (`area_id`)
    REFERENCES `fly_db`.`area` (`area_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_house_registration_state1`
    FOREIGN KEY (`state_id`)
    REFERENCES `fly_db`.`state` (`state_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_house_registration_focus1`
    FOREIGN KEY (`focus_id`)
    REFERENCES `fly_db`.`focus` (`focus_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_house_registration_house1`
    FOREIGN KEY (`house_id`)
    REFERENCES `fly_db`.`house` (`house_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_house_registration_block_registration1`
    FOREIGN KEY (`block_registration_id`)
    REFERENCES `fly_db`.`block_registration` (`block_registration_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_house_registration_team1`
    FOREIGN KEY (`team_id`)
    REFERENCES `fly_db`.`team` (`team_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`tree_species`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`tree_species` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`tree_species` (
  `tree_species_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador de las especies de árboles',
  `tree_species` VARCHAR(45) NOT NULL COMMENT 'nombre de las especies de árboles',
  PRIMARY KEY (`tree_species_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`prospectus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`prospectus` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`prospectus` (
  `prospectus_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del prospecto',
  `units_per_sample` TINYINT(3) NOT NULL COMMENT 'unidades de fruta por muestra asociada al prospecto',
  `has_fly` TINYINT NOT NULL DEFAULT 0 COMMENT 'indica si se ha encontrado mosca en la fruta de la muestra, por defecto no se ha encontrado',
  `analyst` INT NULL COMMENT 'id del usuario analista que analizó la muestra',
  `weight` DECIMAL NULL COMMENT 'peso total de la muestra en kilogramos',
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'fecha de inserción del dato',
  `modifed_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'fecha de modificación del dato',
  PRIMARY KEY (`prospectus_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`tree_state`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`tree_state` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`tree_state` (
  `tree_state_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del estado del árbol',
  `tree_state` VARCHAR(45) NOT NULL COMMENT 'estado del árbol, puede ser:\ncon fruta madura, con fruta verde, sin fruta, nuevo',
  PRIMARY KEY (`tree_state_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`tree_evidence`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`tree_evidence` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`tree_evidence` (
  `tree_evidence_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador y nombre del archivo asociado a la evidencia',
  PRIMARY KEY (`tree_evidence_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`tree_species_registration`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`tree_species_registration` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`tree_species_registration` (
  `tree_species_registration_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador de los registros de las especies de árboles',
  `tree_number` TINYINT NOT NULL COMMENT 'cantidad de árboles de la especie en concreto encontrados en el registro de la casa',
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'fecha de inserción del dato',
  `tree_species_id` INT NOT NULL COMMENT 'especie del árbol a registrar',
  `tree_state_id` INT NOT NULL COMMENT 'estado del árbol, se considera el árbol en peor estado (con fruta madura) hacia abajo (árbol nuevo)',
  `house_registration_id` INT NOT NULL COMMENT 'registro de casa asociado',
  `prospectus_id` INT NULL COMMENT 'prospecto asociado en caso de tener como estado: con fruta madura',
  `tree_evidence_id` INT NULL COMMENT 'foto opcional para evidenciar el estado del árbol',
  PRIMARY KEY (`tree_species_registration_id`),
  INDEX `fk_tree_registration_tree1_idx` (`tree_species_id` ASC) ,
  INDEX `fk_tree_registration_house_registration1_idx` (`house_registration_id` ASC) ,
  INDEX `fk_tree_species_registration_prospectus1_idx` (`prospectus_id` ASC) ,
  INDEX `fk_tree_species_registration_tree_state1_idx` (`tree_state_id` ASC) ,
  INDEX `fk_tree_species_registration_tree_evidence1_idx` (`tree_evidence_id` ASC) ,
  CONSTRAINT `fk_tree_registration_tree1`
    FOREIGN KEY (`tree_species_id`)
    REFERENCES `fly_db`.`tree_species` (`tree_species_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tree_registration_house_registration1`
    FOREIGN KEY (`house_registration_id`)
    REFERENCES `fly_db`.`house_registration` (`house_registration_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tree_species_registration_prospectus1`
    FOREIGN KEY (`prospectus_id`)
    REFERENCES `fly_db`.`prospectus` (`prospectus_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tree_species_registration_tree_state1`
    FOREIGN KEY (`tree_state_id`)
    REFERENCES `fly_db`.`tree_state` (`tree_state_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tree_species_registration_tree_evidence1`
    FOREIGN KEY (`tree_evidence_id`)
    REFERENCES `fly_db`.`tree_evidence` (`tree_evidence_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`user_register`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`user_register` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`user_register` (
  `user_register_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del registro del usuario',
  `campaign_id` INT NOT NULL COMMENT 'campaña en que se registro el usuario',
  `user_id` INT NOT NULL COMMENT 'usuario que se registro en la campaña',
  INDEX `fk_campaign_has_user_user1_idx` (`user_id` ASC) ,
  INDEX `fk_campaign_has_user_campaign1_idx` (`campaign_id` ASC) ,
  PRIMARY KEY (`user_register_id`),
  CONSTRAINT `fk_campaign_has_user_campaign1`
    FOREIGN KEY (`campaign_id`)
    REFERENCES `fly_db`.`campaign` (`campaign_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_campaign_has_user_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `fly_db`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fly_db`.`attendance`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fly_db`.`attendance` ;

CREATE TABLE IF NOT EXISTS `fly_db`.`attendance` (
  `attendance_id` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador de la asistencia',
  `date` DATE NOT NULL DEFAULT CURRENT_DATE COMMENT 'fecha de la asistencia',
  `user_id` INT NOT NULL COMMENT 'identificador del funcionario',
  `is_present` TINYINT NOT NULL DEFAULT 0 COMMENT 'indica si el funcionario se presento a trabajar\npor defecto se inserta ausente',
  PRIMARY KEY (`attendance_id`))
ENGINE = InnoDB;



insert into role (role_id, role_name) values (1,'jefe de campaña');
insert into role (role_id, role_name) values (2,'supervisor');
insert into role (role_id, role_name) values (3,'prospector');
insert into role (role_id, role_name) values (4,'analista');
insert into role (role_id, role_name) values (5,'administrador');

-- ------------------3	

-- ----- map --------

-- ------------------

insert into map (map_id) values (1);
insert into map (map_id) values (2);
insert into map (map_id) values (3);

-- ------------------

-- ----- area -------

-- ------------------

insert into area (area_id, area) values (1, 200);
insert into area (area_id, area) values (2, 400);
insert into area (area_id, area) values (3, 800);

-- ------------------

-- ---- state -------

-- ------------------

insert into state (state_id, state) values (1,'se niega');
insert into state (state_id, state) values (2,'sin moradores');
insert into state (state_id, state) values (3,'abierta');
insert into state (state_id, state) values (4,'cerrada');

-- -------------------

-- -- tree_state -----

-- -------------------

insert into tree_state (tree_state_id, tree_state) values (1,'fruta madura');
insert into tree_state (tree_state_id, tree_state) values (2,'fruta verde');
insert into tree_state (tree_state_id, tree_state) values (3,'sin fruta');
insert into tree_state (tree_state_id, tree_state) values (4,'árbol nuevo');

-- ------------------

-- ---- block -------

-- ------------------

insert into block (block_id, streets) values (1, 'Rowland Trail@Blackbird Lane@Sunfield Alley@Golf Circle');
insert into block (block_id, streets) values (2, 'Morning Drive@Bowman Avenue@Northridge Plaza@Green Center');
insert into block (block_id, streets) values (3, 'Kedzie Place@Warner Hill@Cambridge Park@Rutledge Street');
insert into block (block_id, streets) values (4, 'Dexter Junction@Rowland Junction@Trailsway Terrace@Erie Avenue');

-- -----------------------

-- ---- attendance -------

-- -----------------------

insert into attendance (attendance_id, date, user_id, is_present) values (1, '2023-04-24', 275, true);
insert into attendance (attendance_id, date, user_id, is_present) values (2, '2023-04-24', 593, true);
insert into attendance (attendance_id, date, user_id, is_present) values (3, '2023-04-24', 840, true);
insert into attendance (attendance_id, date, user_id, is_present) values (4, '2023-04-24', 551, false);
insert into attendance (attendance_id, date, user_id, is_present) values (5, '2023-04-24', 352, true);
insert into attendance (attendance_id, date, user_id, is_present) values (6, '2023-04-24', 371, true);
insert into attendance (attendance_id, date, user_id, is_present) values (7, '2023-04-24', 404, true);
insert into attendance (attendance_id, date, user_id, is_present) values (8, '2023-04-24', 984, true);
insert into attendance (attendance_id, date, user_id, is_present) values (9, '2023-04-24', 752, false);
insert into attendance (attendance_id, date, user_id, is_present) values (10, '2023-04-24', 542, true);
insert into attendance (attendance_id, date, user_id, is_present) values (11, '2023-04-24', 351, true);
insert into attendance (attendance_id, date, user_id, is_present) values (12, '2023-04-24', 128, true);
insert into attendance (attendance_id, date, user_id, is_present) values (13, '2023-04-24', 137, true);
insert into attendance (attendance_id, date, user_id, is_present) values (14, '2023-04-24', 368, true);
insert into attendance (attendance_id, date, user_id, is_present) values (15, '2023-04-24', 573, true);

-- ------------------

-- -- house ---------

-- ------------------

insert into house (house_id, address, block_id) values (1, '977 BlackbirBowman Avenued Lane', 1);
insert into house (house_id, address, block_id) values (2, '814 Morning Drive', 2);
insert into house (house_id, address, block_id) values (3, '766 Morning Drive', 2);
insert into house (house_id, address, block_id) values (4, '52 Cambridge Park', 3);
insert into house (house_id, address, block_id) values (5, '141 Sunfield Alley', 1);
insert into house (house_id, address, block_id) values (6, '204 Warner Hill', 3);
insert into house (house_id, address, block_id) values (7, '229 Bowman Avenue', 2);
insert into house (house_id, address, block_id) values (8, '473 Dexter Junction', 4);
insert into house (house_id, address, block_id) values (9, '761 Rowland Trail', 1);
insert into house (house_id, address, block_id) values (10, '87 Blackbird Lane', 1);
insert into house (house_id, address, block_id) values (11, '32 Warner Hill', 3);
insert into house (house_id, address, block_id) values (12, '199 Rowland Junction', 4);
insert into house (house_id, address, block_id) values (13, '660 Northridge Plaza', 2);
insert into house (house_id, address, block_id) values (14, '372 Morning Drive', 2);
insert into house (house_id, address, block_id) values (15, '619 Rowland Trail', 1);
insert into house (house_id, address, block_id) values (16, '643 Rutledge Street', 3);
insert into house (house_id, address, block_id) values (17, '835 Cambridge Park', 3);
insert into house (house_id, address, block_id) values (18, '711 Rowland Junction', 4);
insert into house (house_id, address, block_id) values (19, '870 Cambridge Park', 3);
insert into house (house_id, address, block_id) values (20, '343 Rowland Trail', 1);
insert into house (house_id, address, block_id) values (21, '185 Sunfield Alley', 1);
insert into house (house_id, address, block_id) values (22, '639 Bowman Avenue', 2);
insert into house (house_id, address, block_id) values (23, '181 Morning Drive', 2);
insert into house (house_id, address, block_id) values (24, '408 Trailsway Terrace', 4);
insert into house (house_id, address, block_id) values (25, '246 Erie Avenue', 4);
insert into house (house_id, address, block_id) values (26, '256 Cambridge Park', 3);
insert into house (house_id, address, block_id) values (27, '430 Morning Drive', 2);
insert into house (house_id, address, block_id) values (28, '798 Blackbird Lane', 1);
insert into house (house_id, address, block_id) values (29, '768 Rowland Junction', 4);
insert into house (house_id, address, block_id) values (30, '80 Bowman Avenue', 2);
insert into house (house_id, address, block_id) values (31, '658 Sunfield Alley', 1);
insert into house (house_id, address, block_id) values (32, '645 Morning Drive', 2);
insert into house (house_id, address, block_id) values (33, '576 Kedzie Place', 3);
insert into house (house_id, address, block_id) values (34, '52 Sunfield Alley', 1);
insert into house (house_id, address, block_id) values (35, '581 Northridge Plaza', 2);
insert into house (house_id, address, block_id) values (36, '992 Rowland Junction', 4);
insert into house (house_id, address, block_id) values (37, '737 Cambridge Park', 3);
insert into house (house_id, address, block_id) values (38, '656 Bowman Avenue', 2);
insert into house (house_id, address, block_id) values (39, '564 Morning Drive', 2);
insert into house (house_id, address, block_id) values (40, '890 Erie Avenue', 4);
insert into house (house_id, address, block_id) values (41, '693 Trailsway Terrace', 4);
insert into house (house_id, address, block_id) values (42, '616 Cambridge Park', 3);
insert into house (house_id, address, block_id) values (43, '34 Bowman Avenue', 2);
insert into house (house_id, address, block_id) values (44, '646 Northridge Plaza', 2);
insert into house (house_id, address, block_id) values (45, '700 Morning Drive', 2);
insert into house (house_id, address, block_id) values (46, '750 Rutledge Street', 3);
insert into house (house_id, address, block_id) values (47, '22 Rowland Trail', 1);
insert into house (house_id, address, block_id) values (48, '741 Rutledge Street', 3);
insert into house (house_id, address, block_id) values (49, '70 Cambridge Park', 3);
insert into house (house_id, address, block_id) values (50, '320 Kedzie Place', 3);
insert into house (house_id, address, block_id) values (51, '578 Kedzie Place', 3);
insert into house (house_id, address, block_id) values (52, '717 Rowland Junction', 4);
insert into house (house_id, address, block_id) values (53, '516 Rowland Junction', 4);
insert into house (house_id, address, block_id) values (54, '285 Kedzie Place', 3);
insert into house (house_id, address, block_id) values (55, '35 Morning Drive', 2);
insert into house (house_id, address, block_id) values (56, '280 Sunfield Alley', 1);
insert into house (house_id, address, block_id) values (57, '27 Northridge Plaza', 2);
insert into house (house_id, address, block_id) values (58, '28 Rowland Trail', 1);
insert into house (house_id, address, block_id) values (59, '359 Blackbird Lane', 1);
insert into house (house_id, address, block_id) values (60, '144 Erie Avenue', 4);
insert into house (house_id, address, block_id) values (61, '276 Morning Drive', 2);
insert into house (house_id, address, block_id) values (62, '470 Northridge Plaza', 2);
insert into house (house_id, address, block_id) values (63, '838 Warner Hill', 3);
insert into house (house_id, address, block_id) values (64, '237 Sunfield Alley', 1);
insert into house (house_id, address, block_id) values (65, '435 Morning Drive', 2);
insert into house (house_id, address, block_id) values (66, '392 Morning Drive', 2);
insert into house (house_id, address, block_id) values (67, '309 Rowland Junction', 4);
insert into house (house_id, address, block_id) values (68, '9 Blackbird Lane', 1);
insert into house (house_id, address, block_id) values (69, '727 Golf Circle', 1);
insert into house (house_id, address, block_id) values (70, '625 Trailsway Terrace', 4);
insert into house (house_id, address, block_id) values (71, '133 Morning Drive', 2);
insert into house (house_id, address, block_id) values (72, '208 Golf Circle', 1);
insert into house (house_id, address, block_id) values (73, '634 Golf Circle', 1);
insert into house (house_id, address, block_id) values (74, '13 Northridge Plaza', 2);
insert into house (house_id, address, block_id) values (75, '664 Blackbird Lane', 1);
insert into house (house_id, address, block_id) values (76, '123 Dexter Junction', 4);
insert into house (house_id, address, block_id) values (77, '675 Bowman Avenue', 2);
insert into house (house_id, address, block_id) values (78, '934 Rowland Trail', 1);
insert into house (house_id, address, block_id) values (79, '8 Sunfield Alley', 1);
insert into house (house_id, address, block_id) values (80, '792 Morning Drive', 2);


-- ------------------

-- ---- user --------

-- ------------------




insert into user (user_id, name, email, password, has_license, active, role_id) values (1, 'Demetris', 'dhuxtable1@desdev.cn', 'uZCyxlEazSF', 0, 1, 4);
insert into user (user_id, name, email, password, has_license, active, role_id) values (2, 'Dollie', 'drennles0@weebly.com', '0sesEG0U2', 1, 1, 5);
insert into user (user_id, name, email, password, has_license, active, role_id) values (3, 'Rhoda', 'rbawme2@opera.com', 'BJS4DvohJ8dw', 0, 1, 1);
insert into user (user_id, name, email, password, has_license, active, role_id) values (4, 'Donna', 'deversley3@sitemeter.com', 'cituiyxXlv', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (5, 'Taryn', 'tlinde4@hc360.com', 'tb5gcp2FPVP', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (6, 'Robinia', 'rshewring5@accuweather.com', 'd9aAvn', 0, 1, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (7, 'Adriane', 'atreen6@twitter.com', 'jIR4m7U', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (8, 'Karlyn', 'kkarslake7@edublogs.org', 'm9e1i3', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (9, 'Hyatt', 'hblacklock8@webmd.com', '1l20g89yIkEO', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (10, 'Carlen', 'cmenure9@bloglovin.com', 'Odr9trYnW9', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (11, 'Mozes', 'mkleemana@icio.us', 'QLtzrf', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (12, 'Cathee', 'cfathersb@google.fr', 'Wgmkssy', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (13, 'Giusto', 'gdigweedc@wikimedia.org', 'ahQajcR', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (14, 'Chic', 'ciannuzzellid@si.edu', '5rl1G9W45F', 0, 1, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (15, 'Gay', 'gmellerse@angelfire.com', 'Yzn7IiMU9Xj', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (16, 'Guglielma', 'gmogganf@canalblog.com', 'mcSJhYxbtoAL', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (17, 'Terrye', 'tpresshaughg@wunderground.com', 'bjCES8t', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (18, 'Shell', 'shackneyh@51.la', 'eSAu1eiywjwz', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (19, 'Dominga', 'dboshelli@utexas.edu', 'y2OI1gE1', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (20, 'Dav', 'ddenisevichj@ed.gov', 'WDgooaiV3N', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (21, 'Miof mela', 'mdillowayk@plala.or.jp', 'czQUrKiO', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (22, 'Rosabella', 'rtarquinil@craigslist.org', 'cVcpjUj3G', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (23, 'Elga', 'eloffelm@artisteer.com', 'aseky5MP8', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (24, 'Danita', 'dasquithn@bizjournals.com', 'szZvLwNPFY7', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (25, 'Barny', 'bthoraldo@wordpress.org', 'tuW5io37', 0, 1, 1);
insert into user (user_id, name, email, password, has_license, active, role_id) values (26, 'Ruthi', 'rurwinp@nature.com', '01hTMAGc1VbH', 1, 0, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (27, 'Chucho', 'cdickinsonq@gizmodo.com', '4NW0RO', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (28, 'Zolly', 'zhoveyr@xinhuanet.com', 'YArfX9bTd', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (29, 'Ward', 'wjuzas@netvibes.com', '9ORQaoZQS', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (30, 'Colan', 'cgreenleest@yellowbook.com', '1jy5uz5', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (31, 'York', 'ycorreu@foxnews.com', 'JJjPdbM', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (32, 'Sebastiano', 'scotterv@microsoft.com', 'P1TbaRAnQ5', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (33, 'Mab', 'mfenemorew@berkeley.edu', 'v07LNpz8u', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (34, 'Judah', 'jcolreinx@barnesandnoble.com', 'I1iEvlaXP', 1, 0, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (35, 'Jayne', 'jwilmotty@g.co', 'UW57ks7Qp8', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (36, 'Willard', 'wgronousz@nbcnews.com', 'vEjb47301f', 1, 0, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (37, 'Tammie', 'tstute10@virginia.edu', 'A8nwCEcmkMV', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (38, 'Dannye', 'dcharle11@google.com.hk', 'saD9lQ', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (39, 'Sheridan', 'shandscomb12@privacy.gov.au', 'NPAvybH', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (40, 'Bernarr', 'bolivetta13@photobucket.com', 'lq5aut', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (41, 'Guthrey', 'gshawley14@networkadvertising.org', 'ADSRT6kbCB', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (42, 'Alanson', 'awolfendale15@merriam-webster.com', 'Ek6FkEFwSonb', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (43, 'Sarah', 'ssieghard16@forbes.com', '3n4hzePC5', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (44, 'Delainey', 'dnorfolk17@seesaa.net', 'xPlZArw6ll', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (45, 'Shae', 'sdonaher18@youtube.com', 'kx0mZusR2', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (46, 'Wyn', 'wsollam19@fc2.com', 'ten7aUb5', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (47, 'Nana', 'nowtram1a@usda.gov', 'fia5Fj0bk', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (48, 'Ema', 'ecropp1b@linkedin.com', 'qV0k471wPhj', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (49, 'Boot', 'bsuart1c@e-recht24.de', 'OyyQscKZzhB', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (50, 'Clayborn', 'cbaldam1d@nifty.com', 'R8kYOd', 1, 1, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (51, 'Monti', 'mheindrick1e@noaa.gov', 'OYWeDhUETB', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (52, 'Jaye', 'jocallaghan1f@china.com.cn', 'x4smbJTbz6', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (53, 'Delainey', 'dcouldwell1g@whitehouse.gov', 'ymlvF9', 1, 1, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (54, 'Tiffi', 'tgary1h@webnode.com', 'JE3NT3fL', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (55, 'Mayer', 'mhull1i@constantcontact.com', 'yizBbWDJ0XpO', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (56, 'Ada', 'ayakobowitz1j@wikia.com', 'IiKKEiX5Z', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (57, 'Demeter', 'dphillpot1k@eepurl.com', '1dkp18Xe', 0, 0, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (58, 'Brenn', 'bginsie1l@nature.com', 'QCIXed2afV', 0, 0, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (59, 'Izak', 'icrevy1m@nymag.com', 'hp1wl2MAi', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (60, 'Oswell', 'omarshfield1n@domainmarket.com', 'tkVleczFqSQ', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (61, 'Yovonnda', 'yluttgert1o@twitpic.com', 'VXWl9ScBit', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (62, 'Maurise', 'mrandals1p@example.com', 'Zm72H0A4', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (63, 'Dahlia', 'deastwell1q@wikia.com', 'TfAkq3W', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (64, 'Teddie', 'tweiner1r@reference.com', 'mJuV8Opt', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (65, 'Anna-diane', 'asmerdon1s@livejournal.com', 'AiX8dZRIc5', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (66, 'Pail', 'ppavlenko1t@google.nl', 'CMp5rCfxY1', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (67, 'Tiphany', 'tpinching1u@squarespace.com', '1gTvXSrXA', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (68, 'Charmian', 'crichardes1v@spotify.com', 'sDwapE', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (69, 'Burl', 'bmably1w@samsung.com', 'LxjTwBxpK2g', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (70, 'Armin', 'adcruze1x@histats.com', 'Ze5Ujp', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (71, 'Cornela', 'crenihan1y@cam.ac.uk', 'cZQwy9', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (72, 'Florina', 'fjewks1z@unblog.fr', 'JqLKeJekV', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (73, 'Flem', 'fbraunle20@symantec.com', '12uV8Qk7pN0', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (74, 'Gasper', 'gvittori21@ustream.tv', 'HqIk6jXC5', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (75, 'Keely', 'kobradain22@ftc.gov', '1EqpByHv', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (76, 'Karel', 'kjankin23@blogtalkradio.com', '9xa314f8L', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (77, 'Gard', 'gmcchruiter24@histats.com', 'ej1N9ZGpwRbQ', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (78, 'Wye', 'wgot25@typepad.com', 'yzhDwd4gTrIl', 1, 1, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (79, 'Kimmy', 'kelflain26@wix.com', 'QQZyLl', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (80, 'Kendal', 'kpiller27@nyu.edu', 's7pG0D', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (81, 'Celinda', 'cvize28@addthis.com', 'ZKegwDXu7gP', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (82, 'Zack', 'zjurczak29@toplist.cz', 'DnpCUvX', 0, 0, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (83, 'Babb', 'bfuchs2a@fema.gov', 'MdXYWmEq', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (84, 'Giulietta', 'gfleming2b@ibm.com', 'TGNUhL', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (85, 'Querida', 'qdeport2c@cnn.com', '9SDHIrlBK', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (86, 'Joshia', 'jrouse2d@wufoo.com', 'fuFih9P', 0, 0, 1);
insert into user (user_id, name, email, password, has_license, active, role_id) values (87, 'Mariejeanne', 'mgarroch2e@flickr.com', 'QiujfP1', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (88, 'Max', 'mgilogly2f@google.de', 'JucwwDSz2', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (89, 'Lynn', 'lferreira2g@arizona.edu', 'btSd5FcnUXMz', 1, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (90, 'Fredericka', 'fmacmickan2h@vistaprint.com', 'lJawI2JlI', 0, 0, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (91, 'Aksel', 'aesel2i@g.co', 'aDYJsObyf3ss', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (92, 'Drugi', 'dodyvoy2j@sitemeter.com', 'IhHmonR39Rki', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (93, 'Emelita', 'eputtan2k@stanford.edu', 'Wf5dqUFK4', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (94, 'Sandro', 'sbariball2l@bloomberg.com', 'bc22jyeJT', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (95, 'Jackie', 'jcanfield2m@usda.gov', 'jmkgjNdXS', 0, 1, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (96, 'Mechelle', 'mgalier2n@tuttocitta.it', '3poI1mHkh', 1, 1, 2);
insert into user (user_id, name, email, password, has_license, active, role_id) values (97, 'Ibby', 'ibrandrick2o@abc.net.au', 'RSA1E8bCrl4w', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (98, 'Imojean', 'ikitlee2p@bloglovin.com', 't95Yd5', 1, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (99, 'Egan', 'ecaiger2q@army.mil', 'uWBvYlFCWHK', 0, 1, 3);
insert into user (user_id, name, email, password, has_license, active, role_id) values (100, 'Fiona', 'fkeave2r@bbb.org', 'YjpBCPBh', 0, 1, 3);

-- ------------------

-- -- campaign ------

-- ------------------

insert into campaign (campaign_id, name, open, commune, region, map_id) values (1, 'Campaña Pudahuel 2023 FRUIT FLY PROGRAM', true, 'Pudahuel', 'Metropolitana', 1);
insert into campaign (campaign_id, name, open, commune, region, map_id) values (2, 'Campaña Huechuraba 2023 FRUIT FLY PROGRAM', false, 'Huechuraba', 'Metropolitana', 2);

-- ------------------

-- ----- focus ------

-- ------------------

insert into focus (focus_id, address, active, campaign_id) values (1, '32 Warner Hill', true, 1);

-- ----------------------

-- -- user_register -----

-- ----------------------

insert into user_register (user_register_id, campaign_id, user_id) values (1, 1, 25);
insert into user_register (user_register_id, campaign_id, user_id) values (2, 1, 6);
insert into user_register (user_register_id, campaign_id, user_id) values (3, 1, 14);
insert into user_register (user_register_id, campaign_id, user_id) values (4, 1, 3);
insert into user_register (user_register_id, campaign_id, user_id) values (5, 1, 4);
insert into user_register (user_register_id, campaign_id, user_id) values (6, 1, 5);
insert into user_register (user_register_id, campaign_id, user_id) values (7, 1, 7);
insert into user_register (user_register_id, campaign_id, user_id) values (8, 1, 8);
insert into user_register (user_register_id, campaign_id, user_id) values (9, 1, 9);
insert into user_register (user_register_id, campaign_id, user_id) values (10, 1, 10);
insert into user_register (user_register_id, campaign_id, user_id) values (11, 1, 11);
insert into user_register (user_register_id, campaign_id, user_id) values (12, 1, 12);
insert into user_register (user_register_id, campaign_id, user_id) values (13, 1, 13);
insert into user_register (user_register_id, campaign_id, user_id) values (15, 1, 15);
insert into user_register (user_register_id, campaign_id, user_id) values (16, 1, 16);
insert into user_register (user_register_id, campaign_id, user_id) values (17, 1, 17);
insert into user_register (user_register_id, campaign_id, user_id) values (18, 1, 18);
insert into user_register (user_register_id, campaign_id, user_id) values (19, 1, 19);
insert into user_register (user_register_id, campaign_id, user_id) values (20, 1, 20);
insert into user_register (user_register_id, campaign_id, user_id) values (21, 1, 21);
insert into user_register (user_register_id, campaign_id, user_id) values (22, 1, 22);
insert into user_register (user_register_id, campaign_id, user_id) values (23, 1, 23);
insert into user_register (user_register_id, campaign_id, user_id) values (24, 1, 24);

-- ------------

-- -- car -----

-- ------------

insert into car (car_id, patent, capacity, available) values (1, 'PT3614', 4, false);
insert into car (car_id, patent, capacity, available) values (2, 'ID2814', 4, true);
insert into car (car_id, patent, capacity, available) values (3, 'SB1716', 4, true);
insert into car (car_id, patent, capacity, available) values (4, 'IR5055', 4, true);
insert into car (car_id, patent, capacity, available) values (5, 'CN7572', 4, true);
insert into car (car_id, patent, capacity, available) values (6, 'PK9606', 4, false);
insert into car (car_id, patent, capacity, available) values (7, 'TN4012', 4, true);
insert into car (car_id, patent, capacity, available) values (8, 'IE5793', 2, true);
insert into car (car_id, patent, capacity, available) values (9, 'US8314', 2, false);
insert into car (car_id, patent, capacity, available) values (10, 'ID2578', 2, false);
insert into car (car_id, patent, capacity, available) values (11, 'ET6854', 4, false);
insert into car (car_id, patent, capacity, available) values (12, 'CZ1378', 4, false);
insert into car (car_id, patent, capacity, available) values (13, 'UA2146', 4, true);
insert into car (car_id, patent, capacity, available) values (14, 'PH5998', 2, true);
insert into car (car_id, patent, capacity, available) values (15, 'BR5737', 2, true);
insert into car (car_id, patent, capacity, available) values (16, 'PL3078', 2, true);
insert into car (car_id, patent, capacity, available) values (17, 'KR8391', 4, true);
insert into car (car_id, patent, capacity, available) values (18, 'PT2011', 4, true);
insert into car (car_id, patent, capacity, available) values (19, 'RU2538', 4, false);
insert into car (car_id, patent, capacity, available) values (20, 'ID6814', 2, false);
insert into car (car_id, patent, capacity, available) values (21, 'PH2642', 4, false);
insert into car (car_id, patent, capacity, available) values (22, 'PH3420', 4, false);
insert into car (car_id, patent, capacity, available) values (23, 'CN4951', 2, true);
insert into car (car_id, patent, capacity, available) values (24, 'CA8273', 4, true);
insert into car (car_id, patent, capacity, available) values (25, 'CA4387', 2, true);
insert into car (car_id, patent, capacity, available) values (26, 'YE7269', 4, true);
insert into car (car_id, patent, capacity, available) values (27, 'PH3731', 2, true);
insert into car (car_id, patent, capacity, available) values (28, 'CN8796', 4, true);
insert into car (car_id, patent, capacity, available) values (29, 'KZ4039', 4, false);
insert into car (car_id, patent, capacity, available) values (30, 'PA8226', 4, true);


-- ---------------------------------

-- ------ block_registration -------

-- ---------------------------------

insert into block_registration (block_registration_id, block_id, campaign_id) values (1, 1, 1);
insert into block_registration (block_registration_id, block_id, campaign_id) values (2, 2, 1);
insert into block_registration (block_registration_id, block_id, campaign_id) values (3, 3, 1);
insert into block_registration (block_registration_id, block_id, campaign_id) values (4, 4, 1);


-- -------------------

-- ------ team -------

-- -------------------

insert into team (team_id, tasks, users, campaign_id, car_id) values (1, '1', '3-4-5-7', 1, 2);
insert into team (team_id, tasks, users, campaign_id, car_id) values (2, '2', '8-9', 1, 3);
insert into team (team_id, tasks, users, campaign_id, car_id) values (3, '3-4', '10-11-12-13', 1, 4);

select * from `user` where role_id = 3;


-- ------------------

-- -- tree_species --

-- ------------------

insert into tree_species (tree_species_id, tree_species) values (1,'ají');
insert into tree_species (tree_species_id, tree_species) values (2,'caqui');
insert into tree_species (tree_species_id, tree_species) values (3,'cerezo');
insert into tree_species (tree_species_id, tree_species) values (4,'ciruelo');
insert into tree_species (tree_species_id, tree_species) values (5,'chirimoyo');
insert into tree_species (tree_species_id, tree_species) values (6,'damasco');
insert into tree_species (tree_species_id, tree_species) values (7,'durazno');
insert into tree_species (tree_species_id, tree_species) values (8,'granado');
insert into tree_species (tree_species_id, tree_species) values (9,'higuera');
insert into tree_species (tree_species_id, tree_species) values (10,'limonero');
insert into tree_species (tree_species_id, tree_species) values (11,'lúcumo');
insert into tree_species (tree_species_id, tree_species) values (12,'mandarino');
insert into tree_species (tree_species_id, tree_species) values (13,'manzano');
insert into tree_species (tree_species_id, tree_species) values (14,'membrillero');
insert into tree_species (tree_species_id, tree_species) values (15,'naranjo');
insert into tree_species (tree_species_id, tree_species) values (16,'níspero');
insert into tree_species (tree_species_id, tree_species) values (17,'olivo');
insert into tree_species (tree_species_id, tree_species) values (18,'palto');
insert into tree_species (tree_species_id, tree_species) values (19,'physalis');
insert into tree_species (tree_species_id, tree_species) values (20,'papayo');
insert into tree_species (tree_species_id, tree_species) values (21,'peral');
insert into tree_species (tree_species_id, tree_species) values (22,'pomelo');
insert into tree_species (tree_species_id, tree_species) values (23,'parrón');
insert into tree_species (tree_species_id, tree_species) values (24,'pimiento');
insert into tree_species (tree_species_id, tree_species) values (25,'tomate');
insert into tree_species (tree_species_id, tree_species) values (26,'rosa');

-- ----------------------

-- -- tree_evidence -----

-- ----------------------

insert into tree_evidence (tree_evidence_id) values (1);
insert into tree_evidence (tree_evidence_id) values (2);
insert into tree_evidence (tree_evidence_id) values (3);
insert into tree_evidence (tree_evidence_id) values (4);
insert into tree_evidence (tree_evidence_id) values (5);
insert into tree_evidence (tree_evidence_id) values (6);
insert into tree_evidence (tree_evidence_id) values (7);
insert into tree_evidence (tree_evidence_id) values (8);
insert into tree_evidence (tree_evidence_id) values (9);
insert into tree_evidence (tree_evidence_id) values (10);
insert into tree_evidence (tree_evidence_id) values (11);
insert into tree_evidence (tree_evidence_id) values (12);
insert into tree_evidence (tree_evidence_id) values (13);
insert into tree_evidence (tree_evidence_id) values (14);
insert into tree_evidence (tree_evidence_id) values (15);
insert into tree_evidence (tree_evidence_id) values (16);
insert into tree_evidence (tree_evidence_id) values (17);
insert into tree_evidence (tree_evidence_id) values (18);
insert into tree_evidence (tree_evidence_id) values (19);
insert into tree_evidence (tree_evidence_id) values (20);
insert into tree_evidence (tree_evidence_id) values (21);
insert into tree_evidence (tree_evidence_id) values (22);
insert into tree_evidence (tree_evidence_id) values (23);
insert into tree_evidence (tree_evidence_id) values (24);
insert into tree_evidence (tree_evidence_id) values (25);
insert into tree_evidence (tree_evidence_id) values (26);
insert into tree_evidence (tree_evidence_id) values (27);
insert into tree_evidence (tree_evidence_id) values (28);
insert into tree_evidence (tree_evidence_id) values (29);
insert into tree_evidence (tree_evidence_id) values (30);
insert into tree_evidence (tree_evidence_id) values (31);
insert into tree_evidence (tree_evidence_id) values (32);
insert into tree_evidence (tree_evidence_id) values (33);
insert into tree_evidence (tree_evidence_id) values (34);
insert into tree_evidence (tree_evidence_id) values (35);
insert into tree_evidence (tree_evidence_id) values (36);
insert into tree_evidence (tree_evidence_id) values (37);
insert into tree_evidence (tree_evidence_id) values (38);
insert into tree_evidence (tree_evidence_id) values (39);
insert into tree_evidence (tree_evidence_id) values (40);
insert into tree_evidence (tree_evidence_id) values (41);
insert into tree_evidence (tree_evidence_id) values (42);
insert into tree_evidence (tree_evidence_id) values (43);
insert into tree_evidence (tree_evidence_id) values (44);
insert into tree_evidence (tree_evidence_id) values (45);
insert into tree_evidence (tree_evidence_id) values (46);
insert into tree_evidence (tree_evidence_id) values (47);
insert into tree_evidence (tree_evidence_id) values (48);
insert into tree_evidence (tree_evidence_id) values (49);
insert into tree_evidence (tree_evidence_id) values (50);
insert into tree_evidence (tree_evidence_id) values (51);
insert into tree_evidence (tree_evidence_id) values (52);
insert into tree_evidence (tree_evidence_id) values (53);
insert into tree_evidence (tree_evidence_id) values (54);
insert into tree_evidence (tree_evidence_id) values (55);
insert into tree_evidence (tree_evidence_id) values (56);
insert into tree_evidence (tree_evidence_id) values (57);
insert into tree_evidence (tree_evidence_id) values (58);
insert into tree_evidence (tree_evidence_id) values (59);
insert into tree_evidence (tree_evidence_id) values (60);
insert into tree_evidence (tree_evidence_id) values (61);
insert into tree_evidence (tree_evidence_id) values (62);
insert into tree_evidence (tree_evidence_id) values (63);
insert into tree_evidence (tree_evidence_id) values (64);
insert into tree_evidence (tree_evidence_id) values (65);
insert into tree_evidence (tree_evidence_id) values (66);
insert into tree_evidence (tree_evidence_id) values (67);
insert into tree_evidence (tree_evidence_id) values (68);
insert into tree_evidence (tree_evidence_id) values (69);
insert into tree_evidence (tree_evidence_id) values (70);

-- ----------------------------------

-- ------ house_registration --------

-- ----------------------------------

insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (1, '2022-12-08', 100, 'vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis', 1, 3, 1, 1, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (2, '2023-03-16', 780, 'elit sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec ut', 2, 3, 1, 2, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (3, '2022-11-27', 102, 'rhoncus mauris enim leo rhoncus sed vestibulum sit amet cursus id turpis integer aliquet massa id', 3, 3, 1, 3, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (4, '2022-04-17', 959, 'in faucibus orci luctus et ultrices posuere cubilia curae nulla dapibus dolor vel est donec odio justo sollicitudin ut suscipit a feugiat et eros', 1, 3, 1, 4, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (5, '2022-05-23', 617, 'dis parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo', 3, 3, 1, 5, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (6, '2022-07-30', 259, 'at velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum justo nec condimentum neque sapien placerat ante nulla justo aliquam quis turpis eget elit sodales scelerisque mauris sit', 2, 3, 1, 6, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (7, '2022-04-15', 752, 'neque duis bibendum morbi non quam nec dui luctus rutrum nulla tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti in eleifend', 1, 3, 1, 7, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (8, '2022-04-19', 713, 'diam in magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt eu felis fusce posuere', 3, 3, 1, 8, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (9, '2022-12-03', 235, 'et ultrices posuere cubilia curae duis faucibus accumsan odio curabitur convallis duis consequat dui nec nisi volutpat eleifend donec ut dolor morbi vel lectus in quam fringilla rhoncus mauris enim leo rhoncus sed vestibulum sit amet cursus id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue', 1, 3, 1, 9, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (10, '2022-12-16', 197, 'pede venenatis non sodales sed tincidunt eu felis fusce posuere felis sed lacus morbi sem mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus semper porta volutpat quam pede lobortis ligula sit amet eleifend pede libero quis orci nullam molestie', 1, 3, 1, 10, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (11, '2023-03-15', 458, 'velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat erat quisque erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus in felis donec', 2, 3, 1, 11, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (12, '2023-01-15', 875, 'dui proin leo odio porttitor id consequat in consequat ut nulla sed accumsan felis ut at dolor quis odio consequat varius integer ac leo pellentesque ultrices mattis odio donec vitae', 1, 3, 1, 12, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (13, '2023-02-17', 406, 'at velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum justo nec condimentum neque sapien placerat ante nulla justo aliquam quis turpis eget elit sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis sed', 1, 3, 1, 13, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (14, '2022-04-03', 537, 'ligula sit amet eleifend pede libero quis orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras in purus eu magna vulputate luctus cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus vivamus vestibulum sagittis sapien cum sociis natoque penatibus et magnis', 3, 3, 1, 14, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (15, '2022-07-03', 634, 'dictumst etiam faucibus cursus urna ut tellus nulla ut erat id mauris vulputate elementum nullam varius nulla facilisi cras non velit nec nisi vulputate nonummy maecenas tincidunt lacus at velit vivamus vel nulla eget eros elementum', 1, 3, 1, 15, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (16, '2022-07-09', 970, 'odio consequat varius integer ac leo pellentesque ultrices mattis odio donec vitae nisi nam ultrices libero non mattis pulvinar nulla pede ullamcorper augue a suscipit nulla', 1, 3, 1, 16, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (17, '2022-04-23', 543, 'aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur', 3, 3, 1, 17, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (18, '2022-12-25', 807, 'nisi vulputate nonummy maecenas tincidunt lacus at velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat erat', 2, 3, 1, 18, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (19, '2022-11-14', 765, 'a odio in hac habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at', 3, 3, 1, 19, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (20, '2022-12-08', 306, 'in magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt eu felis fusce posuere felis sed lacus morbi sem mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus semper porta volutpat quam', 1, 3, 1, 20, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (21, '2022-10-18', 395, 'odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis eu sapien cursus vestibulum proin eu mi nulla ac enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis', 1, 3, 1, 21, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (22, '2022-08-12', 391, 'scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec ut mauris eget', 1, 3, 1, 22, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (23, '2023-03-05', 233, 'pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices', 3, 3, 1, 23, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (24, '2022-05-31', 837, 'scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis nunc proin at turpis a pede posuere nonummy integer non velit donec diam neque vestibulum eget vulputate ut ultrices vel augue vestibulum', 1, 3, 1, 24, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (25, '2022-08-10', 594, 'in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum justo nec condimentum neque sapien placerat ante nulla justo aliquam quis turpis eget elit sodales scelerisque mauris sit amet eros', 3, 3, 1, 25, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (26, '2022-09-02', 305, 'accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec ut mauris eget massa tempor convallis', 1, 3, 1, 26, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (27, '2022-09-26', 971, 'porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus sit amet sem fusce consequat nulla nisl nunc nisl duis bibendum felis sed interdum venenatis turpis enim blandit mi in porttitor pede justo eu massa donec dapibus', 1, 3, 1, 27, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (28, '2022-05-22', 257, 'nec sem duis aliquam convallis nunc proin at turpis a pede', 2, 3, 1, 28, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (29, '2022-11-05', 709, 'ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus sit amet sem fusce', 3, 3, 1, 29, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (30, '2022-12-17', 156, 'erat quisque erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus in felis donec semper sapien a libero nam dui proin leo odio porttitor id consequat in consequat ut nulla sed accumsan felis ut at dolor quis odio consequat', 3, 3, 1, 30, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (31, '2022-11-27', 461, 'orci luctus et ultrices posuere cubilia curae nulla dapibus dolor vel est donec odio justo sollicitudin ut suscipit a feugiat et eros vestibulum ac est lacinia', 1, 3, 1, 31, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (32, '2022-08-01', 957, 'lobortis sapien sapien non mi integer ac neque duis bibendum morbi non quam nec dui luctus rutrum nulla tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti in eleifend quam a odio in hac', 1, 3, 1, 32, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (33, '2023-01-03', 330, 'nulla integer pede justo lacinia eget tincidunt eget tempus vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus sit amet sem fusce consequat nulla', 2, 3, 1, 33, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (34, '2022-04-21', 248, 'erat vestibulum sed magna at nunc commodo placerat praesent blandit nam nulla integer pede justo lacinia eget tincidunt eget tempus vel', 1, 3, 1, 34, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (35, '2023-02-16', 736, 'congue eget semper rutrum nulla nunc purus phasellus in felis donec semper sapien a libero nam dui proin leo odio porttitor id consequat in consequat', 2, 3, 1, 35, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (36, '2022-11-23', 699, 'ut erat curabitur gravida nisi at nibh in hac habitasse platea', 1, 3, 1, 36, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (37, '2022-09-04', 947, 'tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut massa', 3, 3, 1, 37, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (38, '2022-05-19', 694, 'mollis molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum', 1, 3, 1, 38, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (39, '2022-10-28', 539, 'id massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum', 2, 3, 1, 39, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (40, '2022-12-13', 134, 'quisque ut erat curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam', 3, 3, 1, 40, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (41, '2022-10-15', 638, 'sapien placerat ante nulla justo aliquam quis turpis eget elit sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec', 1, 3, 1, 41, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (42, '2022-11-25', 287, 'metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci luctus', 3, 3, 1, 42, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (43, '2023-03-13', 675, 'ultrices libero non mattis pulvinar nulla pede ullamcorper augue a suscipit nulla elit ac nulla sed vel enim sit amet nunc viverra dapibus nulla suscipit ligula in lacus', 1, 3, 1, 43, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (44, '2022-09-01', 771, 'tellus nulla ut erat id mauris vulputate elementum nullam varius nulla facilisi cras non velit nec nisi vulputate nonummy maecenas tincidunt lacus at velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat erat quisque erat eros viverra eget congue eget semper', 2, 3, 1, 44, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (45, '2022-05-16', 626, 'ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices', 3, 3, 1, 45, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (46, '2022-11-27', 785, 'ut odio cras mi pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices phasellus id sapien', 1, 3, 1, 46, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (47, '2023-01-17', 877, 'ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet', 3, 3, 1, 47, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (48, '2023-03-16', 464, 'donec diam neque vestibulum eget vulputate ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet lobortis sapien sapien non mi integer ac neque duis bibendum morbi non quam nec', 3, 3, 1, 48, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (49, '2022-05-08', 453, 'odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis eu sapien cursus vestibulum proin eu mi', 1, 3, 1, 49, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (50, '2022-12-26', 618, 'ultrices erat tortor sollicitudin mi sit amet lobortis sapien sapien non mi integer ac neque duis bibendum morbi non quam nec dui luctus rutrum nulla tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus', 2, 3, 1, 50, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (51, '2022-08-24', 454, 'parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo', 3, 3, 1, 51, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (52, '2022-05-31', 707, 'donec quis orci eget orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio odio elementum eu', 2, 3, 1, 52, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (53, '2022-07-12', 139, 'enim leo rhoncus sed vestibulum sit amet cursus id turpis integer aliquet massa id lobortis', 1, 3, 1, 53, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (54, '2022-05-19', 685, 'orci mauris lacinia sapien quis libero nullam sit amet turpis elementum ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet maecenas', 3, 3, 1, 54, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (55, '2023-01-18', 413, 'nulla elit ac nulla sed vel enim sit amet nunc viverra dapibus nulla suscipit ligula in lacus curabitur at ipsum ac tellus semper interdum mauris ullamcorper purus sit amet nulla quisque arcu libero', 1, 3, 1, 55, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (56, '2022-07-20', 674, 'justo morbi ut odio cras mi pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices', 2, 3, 1, 56, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (57, '2022-05-17', 731, 'nec nisi vulputate nonummy maecenas tincidunt lacus at velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat erat quisque erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus in felis donec semper sapien', 1, 3, 1, 57, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (58, '2023-03-25', 332, 'cursus urna ut tellus nulla ut erat id mauris vulputate elementum nullam varius nulla facilisi cras non', 1, 3, 1, 58, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (59, '2023-03-23', 456, 'posuere nonummy integer non velit donec diam neque vestibulum eget vulputate ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec', 3, 3, 1, 59, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (60, '2022-04-03', 363, 'habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit lacinia erat', 2, 3, 1, 60, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (61, '2023-03-15', 656, 'vulputate nonummy maecenas tincidunt lacus at velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat erat quisque erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus in felis donec semper sapien a', 1, 3, 1, 61, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (62, '2022-10-15', 753, 'congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque', 2, 3, 1, 62, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (63, '2023-04-20', 252, 'vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis eu', 2, 3, 1, 63, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (64, '2023-04-02', 320, 'eros suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec ut mauris eget massa tempor convallis nulla neque libero convallis', 2, 3, 1, 64, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (65, '2022-08-09', 141, 'metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor lacus at turpis donec posuere metus vitae ipsum aliquam non mauris morbi non lectus aliquam sit amet diam in magna', 1, 3, 1, 65, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (66, '2022-05-25', 832, 'scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec ut mauris eget massa tempor convallis nulla neque libero convallis eget eleifend luctus ultricies eu nibh', 2, 3, 1, 66, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (67, '2022-04-01', 228, 'non quam nec dui luctus rutrum nulla tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas', 2, 3, 1, 67, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (68, '2022-10-22', 300, 'quis orci eget orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis eu sapien cursus vestibulum proin eu mi nulla ac', 3, 3, 1, 68, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (69, '2022-12-25', 676, 'sit amet cursus id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue vel accumsan tellus nisi eu orci mauris lacinia sapien quis libero nullam sit amet turpis elementum', 3, 3, 1, 69, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (70, '2022-11-27', 901, 'habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna at', 1, 3, 1, 70, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (71, '2022-08-13', 333, 'non ligula pellentesque ultrices phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur', 2, 3, 1, 71, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (72, '2023-01-27', 572, 'lectus pellentesque at nulla suspendisse potenti cras in purus eu magna', 3, 3, 1, 72, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (73, '2022-08-27', 496, 'in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet maecenas leo odio condimentum id luctus nec molestie', 3, 3, 1, 73, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (74, '2023-02-21', 452, 'in ante vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae', 2, 3, 1, 74, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (75, '2022-04-26', 363, 'molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio', 3, 3, 1, 75, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (76, '2022-10-07', 942, 'ac neque duis bibendum morbi non quam nec dui luctus rutrum nulla tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus', 3, 3, 1, 76, 1, 2);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (77, '2022-12-10', 346, 'mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id', 1, 3, 1, 77, 1, 1);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (78, '2022-07-26', 537, 'consequat metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci luctus', 3, 3, 1, 78, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (79, '2022-09-01', 604, 'sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibus at', 3, 3, 1, 79, 1, 3);
insert into house_registration (house_registration_id, registration, grid, comment, area_id, state_id, focus_id , house_id, block_registration_id, team_id) values (80, '2023-04-12', 161, 'magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt eu felis fusce posuere felis sed lacus morbi sem mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus semper porta volutpat quam pede lobortis ligula sit amet eleifend pede libero', 3, 3, 1, 80, 1, 2);

-- ----------------------------------

-- -- tree_species_registration -----

-- ----------------------------------

-- 20 arboles sin fruta Listo
-- una casa tenga mas de un arbol 
-- Generar tree_species_registration con prospectus_id NULL, generar prospectus y luego hacer UPDATE del prospectus_id de la tabla tree_species_registration

insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (1, 3, 18, 2, 1, null, 1);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (2, 21, 18, 1, 2, null, 2);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (3, 1, 4, 1, 3, null, 3);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (4, 18, 18, 2, 4, null, 4);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (5, 38, 21, 2, 5, null, 5);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (6, 32, 13, 1, 6, null, 6);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (7, 7, 11, 1, 7, null, 7);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (8, 53, 14, 1, 8, null, 8);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (9, 58, 11, 2, 9, null, 9);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (10, 21, 19, 1, 10, null, 10);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (11, 41, 26, 2, 11, null, 11);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (12, 28, 13, 1, 12, null, 12);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (13, 35, 14, 1, 13, null, 13);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (14, 61, 22, 1, 14, null, 14);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (15, 25, 3, 2, 15, null, 15);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (16, 35, 23, 1, 16, null, 16);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (17, 60, 21, 2, 17, null, 17);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (18, 17, 13, 2, 18, null, 18);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (19, 5, 22, 2, 19, null, 19);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (20, 56, 12, 1, 20, null, 20);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (21, 54, 10, 2, 21, null, 21);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (22, 2, 8, 1, 22, null, 22);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (23, 64, 3, 2, 23, null, 23);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (24, 4, 12, 1, 24, null, 24);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (25, 46, 24, 1, 25, null, 25);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (26, 28, 15, 1, 26, null, 26);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (27, 21, 3, 1, 27, null, 27);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (28, 50, 25, 2, 28, null, 28);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (29, 57, 20, 2, 29, null, 29);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (30, 9, 3, 2, 30, null, 30);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (31, 45, 7, 1, 31, null, 31);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (32, 57, 19, 1, 32, null, 32);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (33, 20, 10, 1, 33, null, 33);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (34, 23, 16, 2, 34, null, 34);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (35, 55, 22, 1, 35, null, 35);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (36, 45, 14, 1, 36, null, 36);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (37, 37, 17, 2, 37, null, 37);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (38, 47, 1, 1, 38, null, 38);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (39, 60, 13, 1, 39, null, 39);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (40, 18, 3, 1, 40, null, 40);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (41, 28, 23, 1, 41, null, 41);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (42, 51, 13, 1, 42, null, 42);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (43, 38, 10, 2, 43, null, 43);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (44, 25, 14, 1, 44, null, 44);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (45, 14, 11, 1, 45, null, 45);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (46, 52, 3, 2, 46, null, 46);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (47, 57, 22, 2, 47, null, 47);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (48, 4, 21, 2, 48, null, 48);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (49, 24, 12, 2, 49, null, 49);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (50, 26, 1, 2, 50, null, 50);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (51, 40, 6, 4, 49, null, 51);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (52, 43, 6, 3, 4, null, 52);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (53, 28, 17, 3, 19, null, 53);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (54, 47, 25, 4, 27, null, 54);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (55, 13, 3, 4, 25, null, 55);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (56, 61, 24, 3, 31, null, 56);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (57, 13, 24, 4, 41, null, 57);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (58, 58, 5, 3, 33, null, 58);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (59, 54, 26, 4, 10, null, 59);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (60, 11, 12, 3, 37, null, 60);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (61, 63, 12, 3, 26, null, 61);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (62, 4, 22, 3, 33, null, 62);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (63, 18, 9, 4, 39, null, 63);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (64, 6, 20, 3, 24, null, 64);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (65, 28, 21, 4, 11, null, 65);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (66, 58, 12, 4, 5, null, 66);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (67, 34, 7, 3, 3, null, 67);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (68, 10, 19, 3, 49, null, 68);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (69, 50, 9, 3, 1, null, 69);
insert into tree_species_registration (tree_species_registration_id, tree_number, tree_species_id, tree_state_id, house_registration_id, prospectus_id, tree_evidence_id) values (70, 49, 22, 4, 7, null, 70);

-- -------------------

-- -- prospectus -----

-- -------------------

-- dejar analyst con weight y el resto con analyst NULL y weight NULL

insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (1, 2, true, 1, 37.58);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (2, 18, false, 1, 21.95);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (3, 34, false, 1, 15.04);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (4, 51, false, 1, 24.95);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (5, 1, false, 1, 37.53);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (6, 54, false, 1, 42.46);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (7, 20, false, 1, 40.95);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (8, 38, false, 1, 44.04);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (9, 24, false, 1, 25.82);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (10, 18, false, 1, 27.91);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (11, 30, false, 1, 15.69);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (12, 32, false, 1, 44.17);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (13, 35, false, 1, 44.09);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (14, 3, false, 1, 11.53);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (15, 31, false, 1, 16.19);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (16, 21, false, 1, 10.22);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (17, 32, false, 1, 25.98);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (18, 13, false, 1, 29.23);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (19, 25, false, 1, 17.68);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (20, 38, false, 1, 44.25);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (21, 54, false, 1, 28.38);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (22, 37, false, 1, 18.12);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (23, 64, false, 1, 41.03);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (24, 58, false, 1, 33.74);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (25, 49, false, 1, 11.47);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (26, 11, false, 1, 28.79);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (27, 36, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (28, 38, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (29, 51, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (30, 43, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (31, 43, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (32, 64, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (33, 50, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (34, 26, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (35, 10, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (36, 50, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (37, 26, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (38, 24, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (39, 47, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (40, 53, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (41, 51, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (42, 4, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (43, 53, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (44, 15, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (45, 44, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (46, 46, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (47, 26, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (48, 7, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (49, 14, false, null, null);
insert into prospectus (prospectus_id, units_per_sample, has_fly, analyst, weight) values (50, 12, false, null, null);

-- --------------------------------------------

-- -- tree_species_registration  UPDATE  ------

-- --------------------------------------------

update tree_species_registration set prospectus_id = 1 where tree_species_registration_id = 1;
update tree_species_registration set prospectus_id = 2 where tree_species_registration_id = 2;
update tree_species_registration set prospectus_id = 3 where tree_species_registration_id = 3;
update tree_species_registration set prospectus_id = 4 where tree_species_registration_id = 4;
update tree_species_registration set prospectus_id = 5 where tree_species_registration_id = 5;
update tree_species_registration set prospectus_id = 6 where tree_species_registration_id = 6;
update tree_species_registration set prospectus_id = 7 where tree_species_registration_id = 7;
update tree_species_registration set prospectus_id = 8 where tree_species_registration_id = 8;
update tree_species_registration set prospectus_id = 9 where tree_species_registration_id = 9;
update tree_species_registration set prospectus_id = 10 where tree_species_registration_id = 10;
update tree_species_registration set prospectus_id = 11 where tree_species_registration_id = 11;
update tree_species_registration set prospectus_id = 12 where tree_species_registration_id = 12;
update tree_species_registration set prospectus_id = 13 where tree_species_registration_id = 13;
update tree_species_registration set prospectus_id = 14 where tree_species_registration_id = 14;
update tree_species_registration set prospectus_id = 15 where tree_species_registration_id = 15;
update tree_species_registration set prospectus_id = 16 where tree_species_registration_id = 16;
update tree_species_registration set prospectus_id = 17 where tree_species_registration_id = 17;
update tree_species_registration set prospectus_id = 18 where tree_species_registration_id = 18;
update tree_species_registration set prospectus_id = 19 where tree_species_registration_id = 19;
update tree_species_registration set prospectus_id = 20 where tree_species_registration_id = 20;
update tree_species_registration set prospectus_id = 21 where tree_species_registration_id = 21;
update tree_species_registration set prospectus_id = 22 where tree_species_registration_id = 22;
update tree_species_registration set prospectus_id = 23 where tree_species_registration_id = 23;
update tree_species_registration set prospectus_id = 24 where tree_species_registration_id = 24;
update tree_species_registration set prospectus_id = 25 where tree_species_registration_id = 25;
update tree_species_registration set prospectus_id = 26 where tree_species_registration_id = 26;
update tree_species_registration set prospectus_id = 27 where tree_species_registration_id = 27;
update tree_species_registration set prospectus_id = 28 where tree_species_registration_id = 28;
update tree_species_registration set prospectus_id = 29 where tree_species_registration_id = 29;
update tree_species_registration set prospectus_id = 30 where tree_species_registration_id = 30;
update tree_species_registration set prospectus_id = 31 where tree_species_registration_id = 31;
update tree_species_registration set prospectus_id = 32 where tree_species_registration_id = 32;
update tree_species_registration set prospectus_id = 33 where tree_species_registration_id = 33;
update tree_species_registration set prospectus_id = 34 where tree_species_registration_id = 34;
update tree_species_registration set prospectus_id = 35 where tree_species_registration_id = 35;
update tree_species_registration set prospectus_id = 36 where tree_species_registration_id = 36;
update tree_species_registration set prospectus_id = 37 where tree_species_registration_id = 37;
update tree_species_registration set prospectus_id = 38 where tree_species_registration_id = 38;
update tree_species_registration set prospectus_id = 39 where tree_species_registration_id = 39;
update tree_species_registration set prospectus_id = 40 where tree_species_registration_id = 40;
update tree_species_registration set prospectus_id = 41 where tree_species_registration_id = 41;
update tree_species_registration set prospectus_id = 42 where tree_species_registration_id = 42;
update tree_species_registration set prospectus_id = 43 where tree_species_registration_id = 43;
update tree_species_registration set prospectus_id = 44 where tree_species_registration_id = 44;
update tree_species_registration set prospectus_id = 45 where tree_species_registration_id = 45;
update tree_species_registration set prospectus_id = 46 where tree_species_registration_id = 46;
update tree_species_registration set prospectus_id = 47 where tree_species_registration_id = 47;
update tree_species_registration set prospectus_id = 48 where tree_species_registration_id = 48;
update tree_species_registration set prospectus_id = 49 where tree_species_registration_id = 49;
update tree_species_registration set prospectus_id = 50 where tree_species_registration_id = 50;