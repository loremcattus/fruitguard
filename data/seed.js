import { roles, areas, states, treeStates } from '../src/helpers/enums.js';

export const seed = async (models) => {

  const users = await models.User.bulkCreate([
    { // 0
      name: 'Marco Solís',
      run: 16517394,
      dvRun: '9',
      email: 'ma.solis@sag.cl',
      password: '123',
      hasLicense: true,
      role: roles.ADMIN
    },
    { // 1
      name: 'Jhon Valenzuela',
      run: 11366271,
      dvRun: '7',
      email: 'jh.valenzuela@sag.cl',
      password: '321',
      hasLicense: false,
      role: roles.MANAGER
    },
    { // 2
      name: 'Paulina Ríos',
      run: 24681357,
      dvRun: '8',
      email: 'pa.rios@sag.cl',
      password: 'abc',
      hasLicense: false,
      role: roles.MANAGER
    },
    { // 3
      name: 'Miguel Henríquez',
      run: 21789917,
      dvRun: '4',
      email: 'mi.henriquez@sag.cl',
      password: 'asd',
      hasLicense: false,
      role: roles.ANALYST
    },
    { // 4
      name: 'Carolina Herrera',
      run: 57391026,
      dvRun: '9',
      email: 'ca.herrera@sag.cl',
      password: 'qwe',
      hasLicense: false,
      role: roles.ANALYST
    },
    { // 5
      name: 'Rodrigo Silva',
      run: 13579246,
      dvRun: '2',
      email: 'ro.silva@sag.cl',
      password: 'zxc',
      hasLicense: false,
      role: roles.ANALYST
    },
    { // 6
      name: 'Cristóbal Núñez',
      run: 12431833,
      dvRun: '6',
      email: 'cr.nunez@sag.cl',
      password: 'qwe',
      hasLicense: false,
      role: roles.SUPERVISOR
    },
    { // 7
      name: 'Alejandra Torres',
      run: 38402957,
      dvRun: '1',
      email: 'al.torres@sag.cl',
      password: 'asd',
      hasLicense: true,
      role: roles.SUPERVISOR
    },
    { // 8
      name: 'Laura González',
      run: 12345678,
      dvRun: '9',
      email: 'la.gonzalez@sag.cl',
      password: 'pass123',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 9
      name: 'Carlos Morales',
      run: 87654321,
      dvRun: '0',
      email: 'ca.morales@sag.cl',
      password: 'pass456',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 10
      name: 'Benjamín Durán',
      run: 19105568,
      dvRun: '3',
      email: 'be.duran@sag.cl',
      password: 'dsa',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 11
      name: 'Paula Silva',
      run: 23456789,
      dvRun: '3',
      email: 'pa.silva@sag.cl',
      password: 'pass654',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 12
      name: 'Sofía Mendoza',
      run: 23014759,
      dvRun: '5',
      email: 'so.mendoza@sag.cl',
      password: 'pass789',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 13
      name: 'Gabriel Torres',
      run: 54321678,
      dvRun: '2',
      email: 'ga.torres@sag.cl',
      password: 'pass987',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 14
      name: 'Lucía Herrera',
      run: 34567890,
      dvRun: '4',
      email: 'lu.herrera@sag.cl',
      password: 'pass321',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 15
      name: 'María Rojas',
      run: 45678901,
      dvRun: '7',
      email: 'ma.rojas@sag.cl',
      password: 'pass210',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 16
      name: 'Andrés Castro',
      run: 89012345,
      dvRun: '1',
      email: 'an.castro@sag.cl',
      password: 'pass543',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 17
      name: 'Pablo Soto',
      run: 90123456,
      dvRun: '6',
      email: 'pa.soto@sag.cl',
      password: 'pass876',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 18
      name: 'Andrés Soto',
      run: 10293847,
      dvRun: '5',
      email: 'an.soto@sag.cl',
      password: 'qwerty',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 19
      name: 'Valentina Morales',
      run: 76543210,
      dvRun: '2',
      email: 'va.morales@sag.cl',
      password: 'asdfgh',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 20
      name: 'Pedro Mendoza',
      run: 98765432,
      dvRun: '1',
      email: 'pe.mendoza@sag.cl',
      password: 'zxcvbn',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 21
      name: 'María Torres',
      run: 20304050,
      dvRun: '9',
      email: 'ma.torres@sag.cl',
      password: '123456',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 22
      name: 'Hugo Navarro',
      run: 11223344,
      dvRun: '0',
      email: 'hu.navarro@sag.cl',
      password: 'abcdef',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 23
      name: 'Daniela Ríos',
      run: 55443322,
      dvRun: '4',
      email: 'da.rios@sag.cl',
      password: 'uvwxyz',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 24
      name: 'Carlos Salazar',
      run: 99887766,
      dvRun: '3',
      email: 'ca.salazar@sag.cl',
      password: '987654',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 25
      name: 'Fernanda Castro',
      run: 66778899,
      dvRun: '2',
      email: 'fe.castro@sag.cl',
      password: '54321',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 26
      name: 'Pablo Rojas',
      run: 12121212,
      dvRun: '1',
      email: 'pa.rojas@sag.cl',
      password: '24680',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 27
      name: 'Isabel López',
      run: 98989898,
      dvRun: '7',
      email: 'is.lopez@sag.cl',
      password: '13579',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 28
      name: 'Felipe Montoya',
      run: 30303030,
      dvRun: '5',
      email: 'fe.montoya@sag.cl',
      password: 'qwerty',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 29
      name: 'Ana García',
      run: 40404040,
      dvRun: '4',
      email: 'an.garcia@sag.cl',
      password: 'asdfgh',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 30
      name: 'Roberto Jiménez',
      run: 50505050,
      dvRun: '3',
      email: 'ro.jimenez@sag.cl',
      password: 'zxcvbn',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 31
      name: 'Sandra Castro',
      run: 60606060,
      dvRun: '2',
      email: 'sa.castro@sag.cl',
      password: '123456',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 32
      name: 'Diego Rodríguez',
      run: 70707070,
      dvRun: '1',
      email: 'di.rodriguez@sag.cl',
      password: 'abcdef',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 33
      name: 'Verónica Morales',
      run: 80808080,
      dvRun: '0',
      email: 've.morales@sag.cl',
      password: 'uvwxyz',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 34
      name: 'Felipe Sánchez',
      run: 90909090,
      dvRun: '9',
      email: 'fe.sanchez@sag.cl',
      password: '987654',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 35
      name: 'Javiera Torres',
      run: 10101010,
      dvRun: '8',
      email: 'ja.torres@sag.cl',
      password: '13579',
      hasLicense: false,
      role: roles.SUPERVISOR
    },
    { // 36
      name: 'Ricardo Pizarro',
      run: 11111111,
      dvRun: '7',
      email: 'ri.pizarro@sag.cl',
      password: '24680',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 37
      name: 'Marcela Navarro',
      run: 12121213,
      dvRun: '6',
      email: 'ma.navarro@sag.cl',
      password: '54321',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 38
      name: 'Ignacio González',
      run: 13131313,
      dvRun: '5',
      email: 'ig.gonzalez@sag.cl',
      password: '13579',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 39
      name: 'Beatriz Silva',
      run: 14141414,
      dvRun: '4',
      email: 'be.silva@sag.cl',
      password: '24680',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 40
      name: 'Rafael Mendoza',
      run: 15151515,
      dvRun: '3',
      email: 'ra.mendoza@sag.cl',
      password: '54321',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 41
      name: 'Constanza Torres',
      run: 16161616,
      dvRun: '2',
      email: 'co.torres@sag.cl',
      password: '123456',
      hasLicense: false,
      role: roles.SUPERVISOR
    },
    { // 42
      name: 'Eduardo Rojas',
      run: 17171717,
      dvRun: '1',
      email: 'ed.rojas@sag.cl',
      password: 'abcdef',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 43
      name: 'Laura Salazar',
      run: 18181818,
      dvRun: '0',
      email: 'la.salazar@sag.cl',
      password: 'uvwxyz',
      hasLicense: false,
      role: roles.SUPERVISOR
    },
    { // 44
      name: 'Sebastián Castro',
      run: 19191919,
      dvRun: '9',
      email: 'se.castro@sag.cl',
      password: '987654',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 45
      name: 'Isabella Torres',
      run: 20202020,
      dvRun: '8',
      email: 'is.torres@sag.cl',
      password: '13579',
      hasLicense: false,
      role: roles.SUPERVISOR
    },
    { // 46
      name: 'Mauricio Mendoza',
      run: 21212121,
      dvRun: '7',
      email: 'ma.mendoza@sag.cl',
      password: '24680',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
    { // 47
      name: 'Catalina Pizarro',
      run: 22222222,
      dvRun: '6',
      email: 'ca.pizarro@sag.cl',
      password: '54321',
      hasLicense: false,
      role: roles.PROSPECTOR
    },
    { // 48
      name: 'Gabriel González',
      run: 23232323,
      dvRun: '5',
      email: 'ga.gonzalez@sag.cl',
      password: '13579',
      hasLicense: false,
      role: roles.SUPERVISOR
    },
    { // 49
      name: 'Camila Silva',
      run: 24242424,
      dvRun: '4',
      email: 'ca.silva@sag.cl',
      password: '24680',
      hasLicense: true,
      role: roles.PROSPECTOR
    },
  ]);

  const campaigns = await models.Campaign.bulkCreate([
    {
      name: 'Mosquitas al ataque',
      region: 'Metropolitana de Santiago',
      commune: 'Paine',
      managerId: users[1].dataValues.id
    },
    {
      name: 'Mosquitas y furiosas',
      region: 'Metropolitana de Santiago',
      commune: 'Recoleta',
      managerId: users[2].dataValues.id
    },
  ]);

  await Promise.all([
    campaigns[0].addUser([
      users[6],
      users[8], users[9], users[10], users[11], users[12], users[13], users[14], users[15], users[16], users[17]
    ]),

    campaigns[1].addUser([
      users[7],
      users[18], users[19], users[20], users[21], users[22], users[23], users[24], users[25], users[26], users[27]
    ]),
  ]);

  const focuses = await models.Focus.bulkCreate([
    { address: 'Camino Padre Hurtado' },
    { address: '24 de Abril' },
    { address: 'San Gerardo' },
    { address: 'Guanaco' },
  ]);

  const blocks = await models.Block.bulkCreate([
    { streets: 'Calle 1@Calle 2' },
    { streets: 'Calle 3@Calle 4' },
    { streets: 'Calle 5@Calle 6' },
    { streets: 'Calle 7@Calle 8' },
    { streets: 'Calle 9@Calle 10' },
    { streets: 'Calle 11@Calle 12' },
    { streets: 'Calle 13@Calle 14' },
    { streets: 'Calle 15@Calle 16' },
  ]);

  const houses = await models.House.bulkCreate([
    { address: 'Dirección Casa 1' },
    { address: 'Dirección Casa 2' },
    { address: 'Dirección Casa 3' },
    { address: 'Dirección Casa 4' },
    { address: 'Dirección Casa 5' },
    { address: 'Dirección Casa 6' },
    { address: 'Dirección Casa 7' },
    { address: 'Dirección Casa 8' },
    { address: 'Dirección Casa 9' },
    { address: 'Dirección Casa 10' },
    { address: 'Dirección Casa 11' },
    { address: 'Dirección Casa 12' },
    { address: 'Dirección Casa 13' },
    { address: 'Dirección Casa 14' },
    { address: 'Dirección Casa 15' },
    { address: 'Dirección Casa 16' },
  ]);

  await Promise.all([
    campaigns[0].addFocus([focuses[0], focuses[1]]),
    focuses[0].addBlock([blocks[0], blocks[1]]),
    focuses[1].addBlock([blocks[2], blocks[3]]),
    blocks[0].addHouse([houses[0], houses[1]]),
    blocks[1].addHouse([houses[2], houses[3]]),
    blocks[2].addHouse([houses[4], houses[5]]),
    blocks[3].addHouse([houses[6], houses[7]]),
  ]);
  await Promise.all([
    campaigns[1].addFocus([focuses[2], focuses[3]]),
    focuses[2].addBlock([blocks[4], blocks[5]]),
    focuses[3].addBlock([blocks[6], blocks[7]]),
    blocks[4].addHouse([houses[8], houses[9]]),
    blocks[5].addHouse([houses[10], houses[11]]),
    blocks[6].addHouse([houses[12], houses[13]]),
    blocks[7].addHouse([houses[14], houses[15]]),
  ]);

  const cars = await models.Car.bulkCreate([
    { patent: 'ABC123', capacity: 4, available: true },
    { patent: 'DEF456', capacity: 2, available: true },
    { patent: 'GHI789', capacity: 4, available: false },
    { patent: 'JKL012', capacity: 3, available: true },
    { patent: 'MNO345', capacity: 2, available: false },
    { patent: 'PQR678', capacity: 4, available: true },
    { patent: 'STU901', capacity: 2, available: true },
    { patent: 'VWX234', capacity: 3, available: false },
    { patent: 'YZA567', capacity: 4, available: true },
    { patent: 'BCD890', capacity: 2, available: true },
  ]);

  const teams = await models.Team.bulkCreate([
    {
      CampaignId: campaigns[0].dataValues.id,
      tasks: blocks[0].dataValues.id + ',' + blocks[1].dataValues.id,
      users: users[8].dataValues.id + ',' + users[11].dataValues.id + ',' + users[12].dataValues.id + ',' + users[14].dataValues.id,
      CarId: cars[0].dataValues.id
    },
    {
      CampaignId: campaigns[0].dataValues.id,
      tasks: blocks[2].dataValues.id,
      users: users[9].dataValues.id + ',' + users[13].dataValues.id,
      CarId: cars[1].dataValues.id
    },
    {
      CampaignId: campaigns[0].dataValues.id,
      tasks: blocks[3].dataValues.id,
      users: users[10].dataValues.id + ',' + users[15].dataValues.id + ',' + users[16].dataValues.id,
      CarId: cars[3].dataValues.id
    },
    {
      CampaignId: campaigns[1].dataValues.id,
      tasks: blocks[4].dataValues.id,
      users: users[18].dataValues.id + ',' + users[23].dataValues.id,
      CarId: cars[6].dataValues.id
    },
    {
      CampaignId: campaigns[1].dataValues.id,
      tasks: blocks[5].dataValues.id + ',' + blocks[6].dataValues.id,
      users: users[19].dataValues.id + ',' + users[24].dataValues.id + ',' + users[25].dataValues.id + ',' + users[26].dataValues.id,
      CarId: cars[5].dataValues.id
    },
    {
      CampaignId: campaigns[1].dataValues.id,
      tasks: blocks[7].dataValues.id,
      users: users[20].dataValues.id + ',' + users[27].dataValues.id,
      CarId: cars[9].dataValues.id
    },
  ]);

  const attendances = [];
  for (let i = 0; i < 28; i++) {
    const isPresent = !(i === 17 || i === 21 || i === 22);

    attendances.push({
      userId: users[i].dataValues.id,
      isPresent: isPresent,
    });
  }
  await models.Attendance.bulkCreate(attendances);

  const houseRegistrations = await models.HouseRegistration.bulkCreate([
    {
      grid: 1,
      comment: 'Comentario registro de casa 1',
      area: areas[200],
      state: states.REFUSE,
      HouseId: houses[0].id,
      BlockRegistrationId: blocks[0].dataValues.id,
    },
    {
      grid: 1,
      comment: 'Comentario registro de casa 2',
      area: areas[400],
      state: states.UNINHABITED,
      HouseId: houses[1].id,
      BlockRegistrationId: blocks[0].dataValues.id,
    },
    {
      grid: 2,
      comment: 'Comentario registro de casa 3',
      area: areas[400],
      state: states.OPEN,
      HouseId: houses[2].id,
      BlockRegistrationId: blocks[1].dataValues.id,
    },
    {
      grid: 2,
      comment: 'Comentario registro de casa 4',
      area: areas[800],
      state: states.CLOSE,
      HouseId: houses[3].id,
      BlockRegistrationId: blocks[1].dataValues.id,
    },
    {
      grid: 3,
      comment: 'Comentario registro de casa 5',
      area: areas[200],
      state: states.OPEN,
      HouseId: houses[4].id,
      BlockRegistrationId: blocks[2].dataValues.id,
    },
    {
      grid: 3,
      comment: 'Comentario registro de casa 6',
      area: areas[400],
      state: states.CLOSE,
      HouseId: houses[5].id,
      BlockRegistrationId: blocks[2].dataValues.id,
    },
    {
      grid: 4,
      comment: 'Comentario registro de casa 7',
      area: areas[800],
      state: states.OPEN,
      HouseId: houses[6].id,
      BlockRegistrationId: blocks[3].dataValues.id,
    },
    {
      grid: 4,
      comment: 'Comentario registro de casa 8',
      area: areas[400],
      state: states.CLOSE,
      HouseId: houses[7].id,
      BlockRegistrationId: blocks[3].dataValues.id,
    },
    {
      grid: 5,
      comment: 'Comentario registro de casa 9',
      area: areas[400],
      state: states.CLOSE,
      HouseId: houses[8].id,
      BlockRegistrationId: blocks[4].dataValues.id,
    },
    {
      grid: 5,
      comment: 'Comentario registro de casa 10',
      area: areas[800],
      state: states.OPEN,
      HouseId: houses[9].id,
      BlockRegistrationId: blocks[4].dataValues.id,
    },
    {
      grid: 6,
      comment: 'Comentario registro de casa 11',
      area: areas[400],
      state: states.CLOSE,
      HouseId: houses[10].id,
      BlockRegistrationId: blocks[5].dataValues.id,
    },
    {
      grid: 6,
      comment: 'Comentario registro de casa 12',
      area: areas[200],
      state: states.OPEN,
      HouseId: houses[11].id,
      BlockRegistrationId: blocks[5].dataValues.id,
    },
    {
      grid: 7,
      comment: 'Comentario registro de casa 13',
      area: areas[800],
      state: states.CLOSE,
      HouseId: houses[12].id,
      BlockRegistrationId: blocks[6].dataValues.id,
    },
    {
      grid: 7,
      comment: 'Comentario registro de casa 14',
      area: areas[400],
      state: states.OPEN,
      HouseId: houses[13].id,
      BlockRegistrationId: blocks[6].dataValues.id,
    },
    {
      grid: 8,
      comment: 'Comentario registro de casa 15',
      area: areas[400],
      state: states.UNINHABITED,
      HouseId: houses[14].id,
      BlockRegistrationId: blocks[7].dataValues.id,
    },
    {
      grid: 8,
      comment: 'Comentario registro de casa 16',
      area: areas[200],
      state: states.REFUSE,
      HouseId: houses[15].id,
      BlockRegistrationId: blocks[7].dataValues.id,
    },
  ]);

  const treeSpecies = await models.TreeSpecies.bulkCreate([
    { species: 'ají' },
    { species: 'caqui' },
    { species: 'cerezo' },
    { species: 'ciruelo' },
    { species: 'chirimoyo' },
    { species: 'damasco' },
    { species: 'durazno' },
    { species: 'granado' },
    { species: 'higuera' },
    { species: 'limonero' },
    { species: 'lúcumo' },
    { species: 'mandarino' },
    { species: 'manzano' },
    { species: 'membrillero' },
    { species: 'naranjo' },
    { species: 'níspero' },
    { species: 'olivo' },
    { species: 'palto' },
    { species: 'physalis' },
    { species: 'papayo' },
    { species: 'peral' },
    { species: 'pomelo' },
    { species: 'parrón' },
    { species: 'pimiento' },
    { species: 'tomate' },
    { species: 'rosa' },
  ]);

  const treeSpeciesRegistrations = await models.TreeSpeciesRegistration.bulkCreate([
    {
      tree_number: 3,
      tree_state: treeStates.FRUITLESS,
      HouseRegistrationId: houseRegistrations[0].dataValues.id,
      TreeSpecyId: treeSpecies[1].dataValues.id
    },
    {
      tree_number: 4,
      tree_state: treeStates.RIPE,
      HouseRegistrationId: houseRegistrations[1].dataValues.id,
      TreeSpecyId: treeSpecies[0].dataValues.id
    },
    {
      tree_number: 1,
      tree_state: treeStates.SAPLING,
      HouseRegistrationId: houseRegistrations[2].dataValues.id,
      TreeSpecyId: treeSpecies[2].dataValues.id
    },
    {
      tree_number: 2,
      tree_state: treeStates.UNRIPE,
      HouseRegistrationId: houseRegistrations[3].dataValues.id,
      TreeSpecyId: treeSpecies[4].dataValues.id
    },
    {
      tree_number: 5,
      tree_state: treeStates.RIPE,
      HouseRegistrationId: houseRegistrations[4].dataValues.id,
      TreeSpecyId: treeSpecies[3].dataValues.id
    },
    {
      tree_number: 4,
      tree_state: treeStates.SAPLING,
      HouseRegistrationId: houseRegistrations[5].dataValues.id,
      TreeSpecyId: treeSpecies[5].dataValues.id
    },
    {
      tree_number: 1,
      tree_state: treeStates.UNRIPE,
      HouseRegistrationId: houseRegistrations[6].dataValues.id,
      TreeSpecyId: treeSpecies[7].dataValues.id
    },
    {
      tree_number: 3,
      tree_state: treeStates.FRUITLESS,
      HouseRegistrationId: houseRegistrations[7].dataValues.id,
      TreeSpecyId: treeSpecies[6].dataValues.id
    },
    {
      tree_number: 2,
      tree_state: treeStates.SAPLING,
      HouseRegistrationId: houseRegistrations[8].dataValues.id,
      TreeSpecyId: treeSpecies[8].dataValues.id
    },
    {
      tree_number: 1,
      tree_state: treeStates.UNRIPE,
      HouseRegistrationId: houseRegistrations[9].dataValues.id,
      TreeSpecyId: treeSpecies[10].dataValues.id
    },
    {
      tree_number: 4,
      tree_state: treeStates.FRUITLESS,
      HouseRegistrationId: houseRegistrations[10].dataValues.id,
      TreeSpecyId: treeSpecies[9].dataValues.id
    },
    {
      tree_number: 5,
      tree_state: treeStates.RIPE,
      HouseRegistrationId: houseRegistrations[11].dataValues.id,
      TreeSpecyId: treeSpecies[11].dataValues.id
    },
    {
      tree_number: 2,
      tree_state: treeStates.SAPLING,
      HouseRegistrationId: houseRegistrations[12].dataValues.id,
      TreeSpecyId: treeSpecies[13].dataValues.id
    },
    {
      tree_number: 3,
      tree_state: treeStates.FRUITLESS,
      HouseRegistrationId: houseRegistrations[13].dataValues.id,
      TreeSpecyId: treeSpecies[12].dataValues.id
    },
    {
      tree_number: 1,
      tree_state: treeStates.UNRIPE,
      HouseRegistrationId: houseRegistrations[14].dataValues.id,
      TreeSpecyId: treeSpecies[14].dataValues.id
    },
    {
      tree_number: 2,
      tree_state: treeStates.SAPLING,
      HouseRegistrationId: houseRegistrations[15].dataValues.id,
      TreeSpecyId: treeSpecies[16].dataValues.id
    },
    {
      tree_number: 5,
      tree_state: treeStates.RIPE,
      HouseRegistrationId: houseRegistrations[0].dataValues.id,
      TreeSpecyId: treeSpecies[15].dataValues.id
    },
    {
      tree_number: 3,
      tree_state: treeStates.UNRIPE,
      HouseRegistrationId: houseRegistrations[1].dataValues.id,
      TreeSpecyId: treeSpecies[17].dataValues.id
    },
    {
      tree_number: 4,
      tree_state: treeStates.FRUITLESS,
      HouseRegistrationId: houseRegistrations[2].dataValues.id,
      TreeSpecyId: treeSpecies[19].dataValues.id
    },
    {
      tree_number: 1,
      tree_state: treeStates.SAPLING,
      HouseRegistrationId: houseRegistrations[3].dataValues.id,
      TreeSpecyId: treeSpecies[18].dataValues.id
    },
    {
      tree_number: 2,
      tree_state: treeStates.UNRIPE,
      HouseRegistrationId: houseRegistrations[4].dataValues.id,
      TreeSpecyId: treeSpecies[20].dataValues.id
    },
    {
      tree_number: 5,
      tree_state: treeStates.RIPE,
      HouseRegistrationId: houseRegistrations[5].dataValues.id,
      TreeSpecyId: treeSpecies[22].dataValues.id
    },
    {
      tree_number: 4,
      tree_state: treeStates.SAPLING,
      HouseRegistrationId: houseRegistrations[6].dataValues.id,
      TreeSpecyId: treeSpecies[21].dataValues.id
    },
    {
      tree_number: 1,
      tree_state: treeStates.FRUITLESS,
      HouseRegistrationId: houseRegistrations[7].dataValues.id,
      TreeSpecyId: treeSpecies[23].dataValues.id
    },
    {
      tree_number: 3,
      tree_state: treeStates.RIPE,
      HouseRegistrationId: houseRegistrations[8].dataValues.id,
      TreeSpecyId: treeSpecies[25].dataValues.id
    },
    {
      tree_number: 2,
      tree_state: treeStates.FRUITLESS,
      HouseRegistrationId: houseRegistrations[9].dataValues.id,
      TreeSpecyId: treeSpecies[24].dataValues.id
    },
    {
      tree_number: 1,
      tree_state: treeStates.SAPLING,
      HouseRegistrationId: houseRegistrations[10].dataValues.id,
      TreeSpecyId: treeSpecies[0].dataValues.id
    },
    {
      tree_number: 4,
      tree_state: treeStates.RIPE,
      HouseRegistrationId: houseRegistrations[11].dataValues.id,
      TreeSpecyId: treeSpecies[2].dataValues.id
    },
    {
      tree_number: 5,
      tree_state: treeStates.UNRIPE,
      HouseRegistrationId: houseRegistrations[12].dataValues.id,
      TreeSpecyId: treeSpecies[1].dataValues.id
    },
    {
      tree_number: 2,
      tree_state: treeStates.SAPLING,
      HouseRegistrationId: houseRegistrations[13].dataValues.id,
      TreeSpecyId: treeSpecies[3].dataValues.id
    },
    {
      tree_number: 3,
      tree_state: treeStates.FRUITLESS,
      HouseRegistrationId: houseRegistrations[14].dataValues.id,
      TreeSpecyId: treeSpecies[5].dataValues.id
    },
    {
      tree_number: 1,
      tree_state: treeStates.RIPE,
      HouseRegistrationId: houseRegistrations[15].dataValues.id,
      TreeSpecyId: treeSpecies[4].dataValues.id
    },
  ]);

  const prospectus = await models.Prospectus.bulkCreate([
    {
      units_per_sample: 194,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[21].dataValues.id
    },
    {
      units_per_sample: 170,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[11].dataValues.id
    },
    {
      units_per_sample: 231,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[31].dataValues.id,
    },
    {
      units_per_sample: 213,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[24].dataValues.id
    },
    {
      units_per_sample: 178,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[4].dataValues.id,
    },
    {
      units_per_sample: 238,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[16].dataValues.id
    },
    {
      units_per_sample: 161,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[27].dataValues.id,
    },
    {
      units_per_sample: 205,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[1].dataValues.id,
    },
    {
      units_per_sample: 189,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[14].dataValues.id,
    },
    {
      units_per_sample: 216,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[20].dataValues.id
    },
    {
      units_per_sample: 174,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[17].dataValues.id
    },
    {
      units_per_sample: 242,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[9].dataValues.id,
    },
    {
      units_per_sample: 167,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[28].dataValues.id,
    },
    {
      units_per_sample: 223,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[6].dataValues.id
    },
    {
      units_per_sample: 203,
      treeSpeciesRegistrationId: treeSpeciesRegistrations[3].dataValues.id
    },
  ]);

};
