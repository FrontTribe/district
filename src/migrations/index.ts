import * as migration_20260407_133034 from './20260407_133034';
import * as migration_20260420_163537_anchor_block from './20260420_163537_anchor_block';
import * as migration_20260519_093806_three_columns_hub_fields from './20260519_093806_three_columns_hub_fields';
import * as migration_20260519_120000_menu_hub_tagline from './20260519_120000_menu_hub_tagline';
import * as migration_20260519_140000_buildings_unit_extra_fields from './20260519_140000_buildings_unit_extra_fields';
import * as migration_20260523_133026 from './20260523_133026';

export const migrations = [
  {
    up: migration_20260407_133034.up,
    down: migration_20260407_133034.down,
    name: '20260407_133034',
  },
  {
    up: migration_20260420_163537_anchor_block.up,
    down: migration_20260420_163537_anchor_block.down,
    name: '20260420_163537_anchor_block',
  },
  {
    up: migration_20260519_093806_three_columns_hub_fields.up,
    down: migration_20260519_093806_three_columns_hub_fields.down,
    name: '20260519_093806_three_columns_hub_fields',
  },
  {
    up: migration_20260519_120000_menu_hub_tagline.up,
    down: migration_20260519_120000_menu_hub_tagline.down,
    name: '20260519_120000_menu_hub_tagline',
  },
  {
    up: migration_20260519_140000_buildings_unit_extra_fields.up,
    down: migration_20260519_140000_buildings_unit_extra_fields.down,
    name: '20260519_140000_buildings_unit_extra_fields',
  },
  {
    up: migration_20260523_133026.up,
    down: migration_20260523_133026.down,
    name: '20260523_133026',
  },
];
