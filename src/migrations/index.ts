import * as migration_20260407_133034 from './20260407_133034';
import * as migration_20260420_163537_anchor_block from './20260420_163537_anchor_block';

export const migrations = [
  {
    up: migration_20260407_133034.up,
    down: migration_20260407_133034.down,
    name: '20260407_133034',
  },
  {
    up: migration_20260420_163537_anchor_block.up,
    down: migration_20260420_163537_anchor_block.down,
    name: '20260420_163537_anchor_block'
  },
];
