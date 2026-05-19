import * as migration_20260407_133034 from './20260407_133034';
import * as migration_20260519_093806_three_columns_hub_fields from './20260519_093806_three_columns_hub_fields';
import * as migration_20260519_120000_menu_hub_tagline from './20260519_120000_menu_hub_tagline';

export const migrations = [
  {
    up: migration_20260407_133034.up,
    down: migration_20260407_133034.down,
    name: '20260407_133034',
  },
  {
    up: migration_20260519_093806_three_columns_hub_fields.up,
    down: migration_20260519_093806_three_columns_hub_fields.down,
    name: '20260519_093806_three_columns_hub_fields',
  },
  {
    up: migration_20260519_120000_menu_hub_tagline.up,
    down: migration_20260519_120000_menu_hub_tagline.down,
    name: '20260519_120000_menu_hub_tagline'
  },
];
