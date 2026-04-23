/**
 * MyFS — MiTrials / Scout protocol catalog (demo)
 *
 * - Map trial drawer (`pages/trials/myfs-mitrials.html`): one Protocol `<select>` uses `id` + `selectLabel`.
 * - Scout list (`pages/scout/myfs-scouting.html`): same field trial is shown as two columns —
 *   **Trial name** (`listTrial`) + **Protocol** (`selectLabel`). Same underlying `protocolId`.
 *
 * Keep this file in sync when adding options to the drawer or demo rows in the scout table.
 */
(function (global) {
  var PRESETS = [
    { id: 'il-corn-2026', selectLabel: 'IL corn 2026' },
    { id: 'ne-nitrogen', selectLabel: 'NE nitrogen' },
    { id: 'soy-herbicide', selectLabel: 'Soy herbicide' },
    { id: 'carbon-pilot', selectLabel: 'Carbon pilot' },
    { id: 'great-lakes-no-till', selectLabel: 'Great Lakes no-till' },
    { id: 'stand-count', selectLabel: 'Stand count' },
    { id: 'single-zone-demo', selectLabel: 'Single-zone demo' },
    { id: 'corn-standard', selectLabel: 'Corn standard' },
    { id: 'corn-single-zone', selectLabel: 'Corn — single treatment zone (demo)' },
    { id: 'carbon', selectLabel: 'Carbon' },
    { id: 'no-till', selectLabel: 'No till' },
    { id: 'fungicide', selectLabel: 'Fungicide' },
    { id: 'nitrogen', selectLabel: 'Nitrogen management' },
    { id: 'cover-crop', selectLabel: 'Cover crop' },
    { id: 'herbicide', selectLabel: 'Herbicide' },
    { id: 'seed-treatment', selectLabel: 'Seed treatment' },
    { id: 'adhoc', selectLabel: 'Ad hoc (custom)' }
  ];

  var byId = {};
  PRESETS.forEach(function (p) {
    byId[p.id] = p;
  });

  /**
   * Scout demo rows (same field trials as MiTrials drawer would use): `listTrial` + protocol label from `protocolId`.
   * protocolId null => no trial on field.
   */
  var SCOUT_DEMO_ROWS = [
    { protocolId: 'corn-standard', listTrial: 'IL corn field trial (demo)' },
    { protocolId: 'nitrogen', listTrial: 'NE nitrogen' },
    { protocolId: 'soy-herbicide', listTrial: 'Soy herbicide' },
    { protocolId: null, listTrial: null },
    { protocolId: 'carbon-pilot', listTrial: 'Carbon pilot' },
    { protocolId: 'great-lakes-no-till', listTrial: 'Great Lakes no-till' },
    { protocolId: null, listTrial: null },
    { protocolId: 'stand-count', listTrial: 'Stand count' },
    { protocolId: 'corn-single-zone', listTrial: 'Single-zone demo' },
    { protocolId: 'fungicide', listTrial: 'Fungicide program' }
  ];

  /** Protocol tag picker (scout) — matches MiTrials `selectLabel` vocabulary */
  var PROTOCOL_TAG_LABELS = [
    'Corn standard',
    'Nitrogen management',
    'Post-emerge herbicide',
    'Fungicide application',
    'Carbon pilot',
    'Soy herbicide',
    'No till',
    'Stand count'
  ];

  global.MYFS_MITRIALS_PROTOCOL_PRESETS = PRESETS;
  global.MYFS_MITRIALS_PROTOCOL_BY_ID = byId;
  global.MYFS_SCOUT_DEMO_TRIAL_ROWS = SCOUT_DEMO_ROWS;
  global.MYFS_SCOUT_PROTOCOL_TAG_LABELS = PROTOCOL_TAG_LABELS;

  global.MYFS_mitrialsSelectLabel = function (protocolId) {
    var p = byId[protocolId];
    return p ? p.selectLabel : '';
  };
})(typeof window !== 'undefined' ? window : this);
