import * as migration_20260407_133034 from './20260407_133034';
import * as migration_20260420_163537_anchor_block from './20260420_163537_anchor_block';
import * as migration_20260519_093806_three_columns_hub_fields from './20260519_093806_three_columns_hub_fields';
import * as migration_20260519_120000_menu_hub_tagline from './20260519_120000_menu_hub_tagline';
import * as migration_20260519_140000_buildings_unit_extra_fields from './20260519_140000_buildings_unit_extra_fields';
import * as migration_20260523_133026 from './20260523_133026';
import * as migration_20260523_192127_boutique_landing_redesign from './20260523_192127_boutique_landing_redesign';
import * as migration_20260523_213417 from './20260523_213417';
import * as migration_20260523_234706_sync_menu_schema from './20260523_234706_sync_menu_schema';
import * as migration_20260524_120339_form_blocks_schema_sync from './20260524_120339_form_blocks_schema_sync';

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
  {
    up: migration_20260523_192127_boutique_landing_redesign.up,
    down: migration_20260523_192127_boutique_landing_redesign.down,
    name: '20260523_192127_boutique_landing_redesign',
  },
  {
    up: migration_20260523_213417.up,
    down: migration_20260523_213417.down,
    name: '20260523_213417',
  },
  {
    up: migration_20260523_234706_sync_menu_schema.up,
    down: migration_20260523_234706_sync_menu_schema.down,
    name: '20260523_234706_sync_menu_schema',
  },
  {
    up: migration_20260524_120339_form_blocks_schema_sync.up,
    down: migration_20260524_120339_form_blocks_schema_sync.down,
    name: '20260524_120339_form_blocks_schema_sync'
  },
];
