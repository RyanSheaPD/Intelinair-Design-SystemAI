/**
 * Weather list: load dataset, render rows, sorting, tooltips (Ground Workability & Spray Outlook).
 */
(function () {
  'use strict';

  var L = window.WeatherGroundSprayLogic;
  if (!L) return;

  var SORT_ICONS_BOTH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 9l4-4 4 4M16 15l-4 4-4-4"/></svg>';
  var SORT_ICON_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>';
  var SORT_ICON_UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

  var DATASET_URL = '../data/weather-ground-spray-dataset.json';

  var sortState = { key: 'air_temp_f', dir: 'desc' };
  var rowsData = [];
  var currentView = 'list';

  var LIST_VIEW_ICON_HTML =
    '<svg id="view-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
  var MAP_VIEW_ICON_HTML =
    '<svg id="view-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>';
  var VIEW_TOGGLE_CHECK_HTML =
    '<svg class="view-toggle__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';

  function parseInitialView() {
    try {
      var q = new URLSearchParams(window.location.search || '');
      if (q.get('view') === 'map') return 'map';
      if (q.get('view') === 'list') return 'list';
    } catch (e) {}
    if (window.location.hash === '#map') return 'map';
    if (window.location.hash === '#list') return 'list';
    return 'list';
  }

  function syncViewToggleChrome(view) {
    var toggle = document.getElementById('view-toggle');
    var toggleLabel = document.getElementById('view-toggle-label');
    if (!toggle || !toggleLabel) return;
    toggle.querySelectorAll('.view-toggle__option').forEach(function (o) {
      o.classList.remove('is-active');
      var ch = o.querySelector('.view-toggle__check');
      if (ch) ch.remove();
    });
    var activeOpt = toggle.querySelector('.view-toggle__option[data-view="' + (view === 'map' ? 'map' : 'list') + '"]');
    if (activeOpt) {
      activeOpt.classList.add('is-active');
      activeOpt.insertAdjacentHTML('beforeend', VIEW_TOGGLE_CHECK_HTML);
    }
    toggleLabel.textContent = view === 'map' ? 'Map view' : 'List view';
    var iconEl = document.getElementById('view-toggle-icon');
    if (iconEl) iconEl.outerHTML = view === 'map' ? MAP_VIEW_ICON_HTML : LIST_VIEW_ICON_HTML;
  }

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatNa(val, gdoStyle) {
    if (val == null || val === '') {
      return gdoStyle ? '<span class="text-gdo-na">N/A</span>' : '<span class="text-na">N/A</span>';
    }
    return esc(val);
  }

  function precipCell(f) {
    var a = f.precip_24h_in;
    var b = f.precip_48h_in;
    var sa = typeof a === 'number' ? a + 'in' : '—';
    var sb = typeof b === 'number' ? b + 'in' : '—';
    return esc(sa) + ' | ' + esc(sb);
  }

  function isCoarsePointerUi() {
    return document.documentElement.classList.contains('weather-coarse-pointer');
  }

  /** Map field hover/focus tooltip + map bottom sheet: ?mapTooltip=mini (also 1, true, small). ?mapTooltip=full forces rich. */
  function useMiniMapTooltip() {
    try {
      var q = new URLSearchParams(window.location.search || '');
      var v = (q.get('mapTooltip') || '').toLowerCase();
      if (v === 'full' || v === 'rich' || v === '0' || v === 'false') return false;
      if (v === 'mini' || v === '1' || v === 'true' || v === 'small') return true;
    } catch (e) {}
    return false;
  }

  function statusCellHTML(gwOrSpray, kind) {
    var label = gwOrSpray.status || '—';
    var ariaPrefix = kind === 'spray' ? 'Spray outlook' : 'Ground workability';
    var hint = isCoarsePointerUi()
      ? ' Tap for values and per-metric status.'
      : ' Hover or focus for soil moisture index, values, and per-metric status.';
    var bars =
      kind === 'gw' ? L.listViewGwBarStackHTML(gwOrSpray) : L.listViewSprayBarStackHTML(gwOrSpray);
    return (
      '<div class="status-cell status-cell--bars-only" tabindex="0" data-tooltip-kind="' + esc(kind) + '"' +
      ' aria-label="' + esc(ariaPrefix + ': ' + label + '.' + hint) + '">' +
      bars +
      '</div>'
    );
  }

  function renderRow(f) {
    var gw = L.classifyGroundWorkability(f.soil_moisture_index);
    var spray = L.analyzeSprayOutlook(f);

    var tr = document.createElement('tr');
    tr.dataset.fieldId = f.field_id;

    tr.innerHTML =
      '<td><div class="field-name-cell">' +
      '<div class="field-thumb" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.5"><path d="M3 7l6-4 6 4 6-4v14l-6 4-6-4-6 4z"/></svg></div>' +
      '<a href="#" class="field-name-link">' + esc(f.field_name) + '</a></div></td>' +
      '<td>' + esc(f.farm) + '</td>' +
      '<td>' + esc(f.grower) + '</td>' +
      '<td>' + formatNa(f.gdo, true) + '</td>' +
      '<td>' + (typeof f.air_temp_f === 'number' ? f.air_temp_f + ' °F' : '—') + '</td>' +
      '<td>' + formatNa(f.season_precip_in, false) + '</td>' +
      '<td>' + precipCell(f) + '</td>' +
      '<td>' + (typeof f.humidity_pct === 'number' ? f.humidity_pct + '%' : '—') + '</td>' +
      '<td>' + (typeof f.soil_temp_f === 'number' ? f.soil_temp_f + ' °F' : '—') + '</td>' +
      '<td>' + (typeof f.soil_moisture_index === 'number' ? String(f.soil_moisture_index) : '—') + '</td>' +
      '<td class="status-cell-wrap weather-td-gw">' + statusCellHTML(gw, 'gw') + '</td>' +
      '<td class="status-cell-wrap weather-td-spray">' + statusCellHTML(spray.consolidated, 'spray') + '</td>' +
      '<td>' + esc(f.wind_label || '—') + '</td>';

    return tr;
  }

  function compareGeneric(a, b, key, dir) {
    var mul = dir === 'desc' ? -1 : 1;
    var va = a[key];
    var vb = b[key];
    if (key === 'field_name' || key === 'farm' || key === 'grower' || key === 'gdo') {
      return mul * String(va != null ? va : '').localeCompare(String(vb != null ? vb : ''), undefined, { sensitivity: 'base' });
    }
    var na = va == null || (typeof va === 'number' && Number.isNaN(va));
    var nb = vb == null || (typeof vb === 'number' && Number.isNaN(vb));
    if (na && nb) return (a.field_id || '').localeCompare(b.field_id || '');
    if (na) return 1;
    if (nb) return -1;
    var naNum = Number(va);
    var nbNum = Number(vb);
    if (naNum !== nbNum) return mul * (naNum > nbNum ? 1 : -1);
    return (a.field_id || '').localeCompare(b.field_id || '');
  }

  function sortRows() {
    var key = sortState.key;
    var dir = sortState.dir;
    var desc = dir === 'desc';

    rowsData.sort(function (a, b) {
      var cmp = 0;
      if (key === 'ground_workability') {
        cmp = L.compareWorkabilityIndex(a, b, desc);
      } else if (key === 'spray_outlook') {
        cmp = L.compareSpraySort(a, b);
        if (desc) cmp = -cmp;
      } else {
        cmp = compareGeneric(a, b, key, dir);
      }
      return cmp;
    });
  }

  function redrawTable() {
    var tbody = document.getElementById('weather-tbody');
    if (!tbody) return;
    sortRows();
    tbody.innerHTML = '';
    rowsData.forEach(function (f) {
      tbody.appendChild(renderRow(f));
    });
    bindInteractionHandlers(tbody);
    updateSortHeaders();
    if (currentView === 'map') renderMapFields();
  }

  var tooltipEl;
  var hideTimer;
  var sheetOpenCell = null;
  var sheetEscapeHandler;

  function fieldById(id) {
    for (var i = 0; i < rowsData.length; i++) {
      if (rowsData[i].field_id === id) return rowsData[i];
    }
    return null;
  }

  function detailHtmlForFieldKind(field, kind) {
    if (!field) return '';
    if (kind === 'spray') {
      return L.buildSprayDetailHTML(L.analyzeSprayOutlook(field), field.spray_outlook_last_updated);
    }
    return L.buildWorkabilityDetailHTML(L.classifyGroundWorkability(field.soil_moisture_index), field.ground_workability_last_updated);
  }

  function detailHtmlForCell(cell) {
    var holder = cell.closest('[data-field-id]');
    if (!holder) return '';
    var field = fieldById(holder.dataset.fieldId);
    return detailHtmlForFieldKind(field, cell.dataset.tooltipKind);
  }

  function ensureTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'weather-tooltip weather-tooltip--rich';
      tooltipEl.setAttribute('role', 'tooltip');
      tooltipEl.hidden = true;
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  function showTooltip(html, x, y, opts) {
    var el = ensureTooltip();
    var mini = opts && opts.mini === true;
    el.classList.toggle('weather-tooltip--mini', mini);
    clearTimeout(hideTimer);
    el.innerHTML = html;
    el.hidden = false;
    el.style.left = Math.min(x + 12, window.innerWidth - el.offsetWidth - 16) + 'px';
    el.style.top = Math.min(y + 12, window.innerHeight - el.offsetHeight - 16) + 'px';
  }

  function hideTooltip() {
    hideTimer = setTimeout(function () {
      if (tooltipEl) {
        tooltipEl.hidden = true;
      }
    }, 120);
  }

  function getGwSoSheetEls() {
    return {
      scrim: document.getElementById('gw-so-scrim'),
      sheet: document.getElementById('gw-so-sheet'),
      title: document.getElementById('gw-so-sheet-title'),
      subtitle: document.getElementById('gw-so-sheet-subtitle'),
      body: document.getElementById('gw-so-sheet-body'),
      closeBtn: document.getElementById('gw-so-sheet-close')
    };
  }

  function closeGwSoSheet() {
    var els = getGwSoSheetEls();
    if (els.scrim) els.scrim.hidden = true;
    if (els.sheet) {
      els.sheet.hidden = true;
      els.sheet.setAttribute('aria-hidden', 'true');
    }
    if (sheetOpenCell) {
      sheetOpenCell.setAttribute('aria-expanded', 'false');
      sheetOpenCell = null;
    }
    if (sheetEscapeHandler) {
      document.removeEventListener('keydown', sheetEscapeHandler);
      sheetEscapeHandler = null;
    }
  }

  function openGwSoSheet(kind, fieldName, innerHTML, sheetChrome) {
    var els = getGwSoSheetEls();
    if (!els.sheet || !els.body) return;
    if (sheetChrome && sheetChrome.title) {
      if (els.title) els.title.textContent = sheetChrome.title;
      if (els.subtitle) els.subtitle.textContent = sheetChrome.subtitle || '';
    } else {
      var titleText =
        kind === 'spray'
          ? 'Spray outlook'
          : kind === 'map-field'
            ? 'Ground workability & spray outlook'
            : 'Ground workability';
      if (els.title) els.title.textContent = titleText;
      if (els.subtitle) els.subtitle.textContent = fieldName || '';
    }
    els.body.innerHTML = innerHTML;
    els.scrim.hidden = false;
    els.sheet.hidden = false;
    els.sheet.setAttribute('aria-hidden', 'false');
    if (els.closeBtn) {
      els.closeBtn.focus();
    }
    sheetEscapeHandler = function (ev) {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        closeGwSoSheet();
      }
    };
    document.addEventListener('keydown', sheetEscapeHandler);
  }

  function bindInteractionHandlers(root) {
    if (!root) return;
    var coarse = isCoarsePointerUi();

    root.querySelectorAll('.status-cell').forEach(function (cell) {
      if (coarse) {
        cell.setAttribute('role', 'button');
        cell.setAttribute('aria-expanded', 'false');
      }

      if (!coarse) {
        cell.addEventListener('mouseenter', function (e) {
          showTooltip(detailHtmlForCell(cell), e.clientX, e.clientY);
        });
        cell.addEventListener('mousemove', function (e) {
          if (tooltipEl && !tooltipEl.hidden) {
            tooltipEl.style.left = Math.min(e.clientX + 12, window.innerWidth - tooltipEl.offsetWidth - 16) + 'px';
            tooltipEl.style.top = Math.min(e.clientY + 12, window.innerHeight - tooltipEl.offsetHeight - 16) + 'px';
          }
        });
        cell.addEventListener('mouseleave', hideTooltip);
        cell.addEventListener('focus', function () {
          var r = cell.getBoundingClientRect();
          showTooltip(detailHtmlForCell(cell), r.right, r.top);
        });
        cell.addEventListener('blur', hideTooltip);
      } else {
        cell.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var holder = cell.closest('[data-field-id]');
          var field = holder ? fieldById(holder.dataset.fieldId) : null;
          if (!field) return;
          if (sheetOpenCell && sheetOpenCell !== cell) {
            sheetOpenCell.setAttribute('aria-expanded', 'false');
          }
          sheetOpenCell = cell;
          cell.setAttribute('aria-expanded', 'true');
          openGwSoSheet(cell.dataset.tooltipKind, field.field_name, detailHtmlForFieldKind(field, cell.dataset.tooltipKind));
        });
      }
    });
  }

  /**
   * Normalized 0–100 SVG coords aligned with ../assets/weather-map-fields-bg.png (cover).
   * Each demo field maps to a hit polygon over green parcels on the reference image.
   */
  var MAP_FIELD_POLYGONS = [
    { field_id: 'fld-demo-01', points: '5,12 14,9 17,21 7,24' },
    { field_id: 'fld-demo-02', points: '16,6 27,5 29,17 18,18' },
    { field_id: 'fld-demo-03', points: '3,36 14,32 16,48 5,52' },
    { field_id: 'fld-demo-04', points: '30,18 44,14 47,30 33,34' },
    { field_id: 'fld-demo-05', points: '20,46 34,42 38,60 22,64' },
    { field_id: 'fld-demo-06', points: '46,30 60,26 64,44 48,50' },
    { field_id: 'fld-demo-07', points: '70,22 86,18 90,38 72,42' },
    { field_id: 'fld-demo-08', points: '64,48 80,44 84,62 66,68' }
  ];

  function combinedFieldDetailHTML(field) {
    if (!field) return '';
    var header =
      '<div class="weather-map-tooltip__header">' +
      '<strong>' +
      esc(field.field_name) +
      '</strong>' +
      '<div class="weather-map-tooltip__meta">' +
      esc(field.farm) +
      ' · ' +
      esc(field.grower) +
      '</div></div>';
    if (useMiniMapTooltip()) {
      return (
        header +
        L.buildWorkabilityMinimalHTML(L.classifyGroundWorkability(field.soil_moisture_index)) +
        L.buildSprayMinimalHTML(L.analyzeSprayOutlook(field))
      );
    }
    return header + detailHtmlForFieldKind(field, 'gw') + detailHtmlForFieldKind(field, 'spray');
  }

  function bindMapFieldHitTargets(svg) {
    if (!svg) return;
    var coarse = isCoarsePointerUi();

    svg.querySelectorAll('.weather-map-field-hit').forEach(function (hit) {
      var fid = hit.getAttribute('data-field-id');
      var field = fieldById(fid);
      var fname = field ? field.field_name : 'Field';

      hit.setAttribute('role', 'button');
      hit.setAttribute('tabindex', '0');
      if (coarse) {
        hit.setAttribute('aria-label', fname + ': open ground workability and spray outlook');
        hit.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var f = fieldById(fid);
          if (!f) return;
          var subParts = [];
          if (f.farm) subParts.push(f.farm);
          if (f.grower) subParts.push(f.grower);
          openGwSoSheet('map-field', f.field_name, L.buildMapFieldGwSoClickSheetHTML(f), {
            title: f.field_name,
            subtitle: subParts.join(' · ')
          });
        });
      } else {
        hit.setAttribute('aria-label', fname + ': hover for ground workability and spray outlook');
        hit.addEventListener('mouseenter', function (e) {
          var f = fieldById(fid);
          if (!f) return;
          hit.classList.add('is-hover');
          showTooltip(combinedFieldDetailHTML(f), e.clientX, e.clientY, { mini: useMiniMapTooltip() });
        });
        hit.addEventListener('mousemove', function (e) {
          if (tooltipEl && !tooltipEl.hidden) {
            tooltipEl.style.left = Math.min(e.clientX + 12, window.innerWidth - tooltipEl.offsetWidth - 16) + 'px';
            tooltipEl.style.top = Math.min(e.clientY + 12, window.innerHeight - tooltipEl.offsetHeight - 16) + 'px';
          }
        });
        hit.addEventListener('mouseleave', function () {
          hit.classList.remove('is-hover');
          hideTooltip();
        });
        hit.addEventListener('focus', function () {
          var f = fieldById(fid);
          if (!f) return;
          var r = hit.getBoundingClientRect();
          showTooltip(combinedFieldDetailHTML(f), r.left + r.width / 2, r.top + 8, { mini: useMiniMapTooltip() });
        });
        hit.addEventListener('blur', function () {
          hit.classList.remove('is-hover');
          hideTooltip();
        });
      }
    });
  }

  var mapToolbarWired = false;
  function wireMapLayerToolbar() {
    if (mapToolbarWired) return;
    var bar = document.getElementById('weather-map-layer-toolbar');
    if (!bar) return;
    mapToolbarWired = true;
    bar.querySelectorAll('.tabs__item').forEach(function (tab) {
      tab.addEventListener('click', function () {
        bar.querySelectorAll('.tabs__item').forEach(function (t) {
          t.setAttribute('aria-selected', 'false');
        });
        tab.setAttribute('aria-selected', 'true');
      });
    });
    var stage = document.getElementById('weather-map-stage');
    var fieldsBtn = document.getElementById('weather-map-show-fields-btn');
    var fieldsChk = document.getElementById('weather-map-show-fields');
    if (stage && fieldsBtn) {
      fieldsBtn.addEventListener('click', function () {
        var showing = fieldsBtn.getAttribute('aria-pressed') === 'true';
        var next = !showing;
        fieldsBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
        stage.classList.toggle('weather-map-stage--fields-off', !next);
      });
    } else if (stage && fieldsChk) {
      fieldsChk.addEventListener('change', function () {
        stage.classList.toggle('weather-map-stage--fields-off', !fieldsChk.checked);
      });
    }
  }

  function renderMapFields() {
    var svg = document.getElementById('weather-map-fields-svg');
    if (!svg || rowsData.length === 0) return;

    var idsPresent = {};
    rowsData.forEach(function (f) {
      idsPresent[f.field_id] = true;
    });

    var NS = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';
    MAP_FIELD_POLYGONS.forEach(function (spec) {
      if (!idsPresent[spec.field_id]) return;
      var poly = document.createElementNS(NS, 'polygon');
      poly.setAttribute('class', 'weather-map-field-hit');
      poly.setAttribute('points', spec.points);
      poly.setAttribute('data-field-id', spec.field_id);
      svg.appendChild(poly);
    });
    bindMapFieldHitTargets(svg);
  }

  function setView(view) {
    currentView = view === 'map' ? 'map' : 'list';
    var listPane = document.getElementById('weather-list-pane');
    var mapPane = document.getElementById('weather-map-pane');
    if (listPane) {
      listPane.hidden = currentView !== 'list';
      listPane.setAttribute('aria-hidden', currentView !== 'list' ? 'true' : 'false');
    }
    if (mapPane) {
      mapPane.hidden = currentView !== 'map';
      mapPane.setAttribute('aria-hidden', currentView !== 'map' ? 'true' : 'false');
    }
    syncViewToggleChrome(currentView);
    if (currentView === 'map') renderMapFields();
  }

  window.__WEATHER_SET_VIEW__ = setView;

  var sheetChromeWired = false;
  function wireGwSoSheetChrome() {
    if (sheetChromeWired) return;
    var els = getGwSoSheetEls();
    if (!els.sheet) return;
    sheetChromeWired = true;
    if (els.scrim) els.scrim.addEventListener('click', closeGwSoSheet);
    if (els.closeBtn) els.closeBtn.addEventListener('click', closeGwSoSheet);
  }

  var HEADER_LABELS = {
    field_name: 'Field',
    farm: 'Farm',
    grower: 'Grower',
    gdo: 'GDO',
    air_temp_f: 'Air temp',
    season_precip_in: 'Season precip.',
    precip_24h_in: 'Precip. 24h | 48h',
    humidity_pct: 'Humidity',
    soil_temp_f: 'Soil temp',
    soil_moisture_index: 'Soil moisture',
    ground_workability: 'Ground workability',
    spray_outlook: 'Spray outlook',
    wind_speed_12hr_mph: 'Wind'
  };

  function updateSortHeaders() {
    document.querySelectorAll('#weather-table thead th[data-sort-key]').forEach(function (th) {
      var sk = th.dataset.sortKey;
      var label = HEADER_LABELS[sk] || sk;
      var active = sortState.key === sk;
      th.classList.toggle('th-sortable--active', active);
      var icon = SORT_ICONS_BOTH;
      if (active) icon = sortState.dir === 'desc' ? SORT_ICON_DOWN : SORT_ICON_UP;
      th.querySelector('.sort-indicator').innerHTML = esc(label) + ' ' + icon;
    });
  }

  function wireSortHeaders() {
    document.querySelectorAll('#weather-table thead th[data-sort-key]').forEach(function (th) {
      th.addEventListener('click', function () {
        var sk = th.dataset.sortKey;
        if (sortState.key === sk) {
          sortState.dir = sortState.dir === 'desc' ? 'asc' : 'desc';
        } else {
          sortState.key = sk;
          if (sk === 'ground_workability') sortState.dir = 'desc';
          else if (sk === 'spray_outlook') sortState.dir = 'asc';
          else sortState.dir = 'desc';
        }
        redrawTable();
      });
    });
  }

  function loadDataset() {
    return fetch(DATASET_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
      .then(function (data) {
        return data.fields || [];
      })
      .catch(function () {
        return window.__WEATHER_GROUND_SPRAY_FALLBACK_FIELDS__ || FALLBACK_FIELDS;
      });
  }

  /** Mirrors data/weather-ground-spray-dataset.json when fetch is unavailable (file://). */
  var FALLBACK_FIELDS = [{"field_id":"fld-demo-01","field_name":"Demo field 1","farm":"North Farm","grower":"Alpha Cooperative","gdo":null,"air_temp_f":39,"season_precip_in":null,"precip_24h_in":0,"precip_48h_in":0,"humidity_pct":79,"soil_temp_f":51,"soil_moisture_index":0.335,"wind_speed_12hr_mph":16,"wind_label":"ENE 16 mph","daily_high_temp_f":42,"daily_low_temp_f":34,"ground_workability_last_updated":"2026-04-07T17:00:00.000Z","spray_outlook_last_updated":"2026-04-07T17:00:00.000Z"},{"field_id":"fld-demo-02","field_name":"Demo field 2","farm":"North Farm","grower":"Alpha Cooperative","gdo":null,"air_temp_f":41,"season_precip_in":null,"precip_24h_in":0,"precip_48h_in":0,"humidity_pct":76,"soil_temp_f":50,"soil_moisture_index":0.324,"wind_speed_12hr_mph":14,"wind_label":"ENE 14 mph","daily_high_temp_f":44,"daily_low_temp_f":36,"ground_workability_last_updated":"2026-04-07T17:00:00.000Z","spray_outlook_last_updated":"2026-04-07T17:00:00.000Z"},{"field_id":"fld-demo-03","field_name":"Demo field 3","farm":"West Farm","grower":"Beta Farms","gdo":null,"air_temp_f":37,"season_precip_in":null,"precip_24h_in":0,"precip_48h_in":0.1,"humidity_pct":82,"soil_temp_f":49,"soil_moisture_index":0.33,"wind_speed_12hr_mph":12,"wind_label":"N 12 mph","daily_high_temp_f":40,"daily_low_temp_f":30,"ground_workability_last_updated":"2026-04-07T17:00:00.000Z","spray_outlook_last_updated":"2026-04-07T17:00:00.000Z"},{"field_id":"fld-demo-04","field_name":"Demo field 4","farm":"East Farm","grower":"Gamma LLC","gdo":null,"air_temp_f":40,"season_precip_in":null,"precip_24h_in":0,"precip_48h_in":0,"humidity_pct":77,"soil_temp_f":52,"soil_moisture_index":0.314,"wind_speed_12hr_mph":18,"wind_label":"ESE 18 mph","daily_high_temp_f":72,"daily_low_temp_f":45,"ground_workability_last_updated":"2026-04-07T17:00:00.000Z","spray_outlook_last_updated":"2026-04-07T17:00:00.000Z"},{"field_id":"fld-demo-05","field_name":"Demo field 5","farm":"South Farm","grower":"Beta Farms","gdo":null,"air_temp_f":38,"season_precip_in":null,"precip_24h_in":0,"precip_48h_in":0,"humidity_pct":81,"soil_temp_f":50,"soil_moisture_index":0.318,"wind_speed_12hr_mph":8,"wind_label":"NE 8 mph","daily_high_temp_f":68,"daily_low_temp_f":38,"ground_workability_last_updated":"2026-04-07T17:00:00.000Z","spray_outlook_last_updated":"2026-04-07T17:00:00.000Z"},{"field_id":"fld-demo-06","field_name":"Demo field 6","farm":"East Farm","grower":"Gamma LLC","gdo":null,"air_temp_f":55,"season_precip_in":null,"precip_24h_in":0,"precip_48h_in":0,"humidity_pct":38,"soil_temp_f":54,"soil_moisture_index":0.31,"wind_speed_12hr_mph":7,"wind_label":"SW 7 mph","daily_high_temp_f":78,"daily_low_temp_f":48,"ground_workability_last_updated":"2026-04-07T17:00:00.000Z","spray_outlook_last_updated":"2026-04-07T17:00:00.000Z"},{"field_id":"fld-demo-07","field_name":"Demo field 7","farm":"West Farm","grower":"Beta Farms","gdo":null,"air_temp_f":48,"season_precip_in":null,"precip_24h_in":0.6,"precip_48h_in":0.6,"humidity_pct":92,"soil_temp_f":48,"soil_moisture_index":0.34,"wind_speed_12hr_mph":5,"wind_label":"S 5 mph","daily_high_temp_f":55,"daily_low_temp_f":42,"ground_workability_last_updated":"2026-04-07T17:00:00.000Z","spray_outlook_last_updated":"2026-04-07T17:00:00.000Z"},{"field_id":"fld-demo-08","field_name":"Demo field 8","farm":"South Farm","grower":"Beta Farms","gdo":null,"air_temp_f":52,"season_precip_in":null,"precip_24h_in":0.15,"precip_48h_in":0.2,"humidity_pct":52,"soil_temp_f":53,"soil_moisture_index":0.323,"wind_speed_12hr_mph":12,"wind_label":"NW 12 mph","daily_high_temp_f":70,"daily_low_temp_f":44,"ground_workability_last_updated":"2026-04-07T17:00:00.000Z","spray_outlook_last_updated":"2026-04-07T17:00:00.000Z"}];

  function init() {
    currentView = parseInitialView();
    wireGwSoSheetChrome();
    wireMapLayerToolbar();
    loadDataset().then(function (fields) {
      rowsData = fields.slice();
      document.documentElement.classList.toggle(
        'weather-coarse-pointer',
        window.matchMedia('(hover: none), (pointer: coarse)').matches
      );
      var tbody = document.getElementById('weather-tbody');
      if (!tbody || rowsData.length === 0) {
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="13" class="text-na" style="padding:24px;">No weather rows.</td></tr>';
        }
        setView(currentView);
        return;
      }
      wireSortHeaders();
      redrawTable();
      setView(currentView);
      window.__WEATHER_LIST_EXPORT_FOR_LLM__ = function () {
        return {
          source_file: 'data/weather-ground-spray-dataset.json',
          logic: 'pages/js/weather-ground-spray-logic.js (WeatherGroundSprayLogic)',
          fields: rowsData.map(function (f) {
            var gw = L.classifyGroundWorkability(f.soil_moisture_index);
            var sp = L.analyzeSprayOutlook(f);
            return {
              field_id: f.field_id,
              field_name: f.field_name,
              ground_workability: {
                soil_moisture_index: f.soil_moisture_index,
                status: gw.status,
                color: gw.colorName,
                last_updated: f.ground_workability_last_updated
              },
              spray_outlook: {
                status: sp.consolidated.status,
                metrics: sp.metrics.map(function (m) {
                  return { label: m.label, value: m.valueDisplay, band: m.band, detail: m.detail };
                }),
                limiting_factors: sp.limitingFactors.map(function (m) {
                  return m.label;
                }),
                last_updated: f.spray_outlook_last_updated
              }
            };
          })
        };
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
