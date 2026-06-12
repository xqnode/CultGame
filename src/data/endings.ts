import type { Ending } from '../types/game'

export const ENDINGS: Ending[] = [
  {
    id: 'ascension',
    title: '飞升成仙',
    description:
      '九霄雷劫过后，你肉身成圣，元神飞升仙界。回首凡间，千年修行化作一念，自此逍遥天外，与天地同寿。',
    priority: 100,
    conditions: [
      { type: 'realm', min: 'nascent_soul' },
      { type: 'stat', key: 'demonHeart', max: 30 },
      { type: 'flag', key: 'got_inheritance', value: true },
      { type: 'flag', key: 'chose_ascension', value: true },
    ],
  },
  {
    id: 'demon_fall',
    title: '堕魔陨落',
    description:
      '心魔吞噬道心，你堕入魔道。最后一战，正道群雄围剿，魔躯崩碎，魂飞魄散，千年修为化为乌有。',
    priority: 90,
    conditions: [
      { type: 'stat', key: 'demonHeart', min: 80 },
      { type: 'flag', key: 'accepted_demon_path', value: true },
    ],
  },
  {
    id: 'body_death',
    title: '身死道消',
    description:
      '天劫之下，肉身崩毁，元神溃散。千年修行，一朝尽付东流。世人只记得，曾有一位修士，陨落于天地之间。',
    priority: 85,
    conditions: [{ type: 'flag', key: 'died_in_tribulation', value: true }],
  },
  {
    id: 'pill_master',
    title: '丹道宗师',
    description:
      '你以丹入道，炼出九转金丹，名震修真界。虽未能飞升，却成为一代丹道宗师，弟子满堂，传承千载。',
    priority: 80,
    conditions: [
      { type: 'stat', key: 'comprehension', min: 60 },
      { type: 'flag', key: 'mastered_alchemy', value: true },
      { type: 'realm', min: 'foundation' },
    ],
  },
  {
    id: 'sect_elder',
    title: '宗门长老',
    description:
      '你忠心宗门，历经磨难，最终成为宗门长老，守护一方山门。虽未证大道，却得万人敬仰，善终宗门。',
    priority: 75,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
      { type: 'flag', key: 'became_elder', value: true },
    ],
  },
  {
    id: 'wandering_hermit',
    title: '逍遥散修',
    description:
      '你拒绝宗门束缚，独行天下，看遍山河岁月。虽未飞升，却活得洒脱自在，成为传说中的一代散修。',
    priority: 70,
    conditions: [
      { type: 'realm', min: 'golden_core' },
      { type: 'flag', key: 'refused_all_sects', value: true },
    ],
  },
  {
    id: 'mortal_life',
    title: '凡人善终',
    description:
      '你放下修仙执念，回归凡尘，娶妻生子，平淡度日。晚年坐在院中品茶，笑谈当年修仙旧事，亦无遗憾。',
    priority: 65,
    conditions: [{ type: 'flag', key: 'gave_up_cultivation', value: true }],
  },
  {
    id: 'natural_death',
    title: '寿尽坐化',
    description:
      '寿元耗尽，你盘坐洞府，元神渐散。未能证道长生，却也在修行路上走过一遭，魂归天地，道消人亡。',
    priority: 10,
    conditions: [{ type: 'lifespan_remaining', max: 0 }],
  },
]
