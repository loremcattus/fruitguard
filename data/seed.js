export const seed = async (models) => {
  const campaign1 = await models.Campaign.create({
    name: 'Mosquitas al ataque',
    region: 'Metropolitana de Santiago',
    commune: 'Paine'
  });

  const campaign2 = await models.Campaign.create({
    name: 'Mosquitas y furiosas',
    region: 'Metropolitana de Santiago',
    commune: 'Recoleta'
  });

  const [focus1_campaign1, focus2_campaign1] = await Promise.all([
    models.Focus.create({ address: 'Camino Padre Hurtado' }),
    models.Focus.create({ address: '24 de Abril' })
  ]);

  const [focus1_campaign2, focus2_campaign2] = await Promise.all([
    models.Focus.create({ address: 'San Gerardo' }),
    models.Focus.create({ address: 'Guanaco' })
  ]);

  const [block1_focus1_campaign1, block2_focus1_campaign1] = await Promise.all([
    models.Block.create({ streets: 'Calle 1@Calle 2' }),
    models.Block.create({ streets: 'Calle 3@Calle 4' })
  ]);

  const [block1_focus2_campaign1, block2_focus2_campaign1] = await Promise.all([
    models.Block.create({ streets: 'Calle 5@Calle 6' }),
    models.Block.create({ streets: 'Calle 7@Calle 8' })
  ]);

  const [block1_focus1_campaign2, block2_focus1_campaign2] = await Promise.all([
    models.Block.create({ streets: 'Calle 9@Calle 10' }),
    models.Block.create({ streets: 'Calle 11@Calle 12' })
  ]);

  const [block1_focus2_campaign2, block2_focus2_campaign2] = await Promise.all([
    models.Block.create({ streets: 'Calle 13@Calle 14' }),
    models.Block.create({ streets: 'Calle 15@Calle 16' })
  ]);

  await Promise.all([
    campaign1.addFocus([focus1_campaign1, focus2_campaign1]),
    focus1_campaign1.addBlock(block1_focus1_campaign1),
    focus1_campaign1.addBlock(block2_focus1_campaign1),
    focus2_campaign1.addBlock(block1_focus2_campaign1),
    focus2_campaign1.addBlock(block2_focus2_campaign1),
    campaign2.addFocus([focus1_campaign2, focus2_campaign2]),
    focus1_campaign2.addBlock(block1_focus1_campaign2),
    focus1_campaign2.addBlock(block2_focus1_campaign2),
    focus2_campaign2.addBlock(block1_focus2_campaign2),
    focus2_campaign2.addBlock(block2_focus2_campaign2)
  ]);
};
  