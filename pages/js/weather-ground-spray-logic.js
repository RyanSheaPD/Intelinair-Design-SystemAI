/**
 * Ground Workability & Spray Outlook — canonical logic for Weather List View and LLM parity.
 * Thresholds and AND rules match product spec; do not recompute differently in LLM layers.
 */
(function (global) {
  'use strict';

  var GW_STATUS = {
    NOT_FIT: 'Not Fit',
    MARGINAL: 'Marginal',
    MOSTLY_FIT: 'Mostly Fit',
    GOOD: 'Good'
  };

  var GW_COLOR = {
    Red: '#c41e3a',
    Orange: '#ea580c',
    Yellow: '#ca8a04',
    Green: '#15803d'
  };

  var SPRAY_STATUS = {
    GOOD: 'Good',
    MARGINAL: 'Marginal',
    AT_RISK: 'At Risk'
  };

  var SPRAY_COLOR = {
    Good: '#15803d',
    Marginal: '#ea580c',
    At_Risk: '#c41e3a'
  };

  function escHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatUpdated(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      if (Number.isNaN(d.getTime())) return escHtml(iso);
      return escHtml(d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }));
    } catch (e) {
      return escHtml(iso);
    }
  }

  /** Drop trailing "(Status)." from band copy when status is already shown in the header. */
  function bandExplanationCompact(bandExplanation, status) {
    if (!bandExplanation) return '';
    var s = String(bandExplanation).trim();
    if (!status) return s;
    var escaped = status.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('\\s*\\(' + escaped + '\\)\\.?$', 'i');
    return s.replace(re, '.');
  }

  function metricShortName(m) {
    var L = m.label || '';
    if (/Wind/i.test(L)) return 'Wind';
    if (/high/i.test(L)) return 'High temp';
    if (/low/i.test(L)) return 'Low temp';
    if (/Precip/i.test(L)) return 'Precip';
    if (/Humidity/i.test(L)) return 'Humidity';
    return L;
  }

  /** CSS modifier for metric / consolidated pills */
  function sprayPillModifier(band) {
    if (band === 'Good') return 'good';
    if (band === 'Marginal') return 'marginal';
    return 'at-risk';
  }

  /**
   * IBM soil moisture index → workability (boundaries per spec).
   * > 0.327 Not Fit | 0.322–0.326 Marginal | 0.316–0.321 Mostly Fit | < 0.316 Good
   */
  function classifyGroundWorkability(soilMoistureIndex) {
    var x = soilMoistureIndex;
    if (typeof x !== 'number' || Number.isNaN(x)) {
      return {
        status: '—',
        colorName: '',
        hex: '#9ca3af',
        soil_moisture_index: x,
        bandExplanation: 'Soil moisture index unavailable.'
      };
    }
    if (x > 0.327) {
      return {
        status: GW_STATUS.NOT_FIT,
        colorName: 'Red',
        hex: GW_COLOR.Red,
        soil_moisture_index: x,
        bandExplanation: 'Index above 0.327 (Not Fit).'
      };
    }
    if (x >= 0.322 && x <= 0.326) {
      return {
        status: GW_STATUS.MARGINAL,
        colorName: 'Orange',
        hex: GW_COLOR.Orange,
        soil_moisture_index: x,
        bandExplanation: 'Index between 0.322 and 0.326 (Marginal).'
      };
    }
    if (x >= 0.316 && x <= 0.321) {
      return {
        status: GW_STATUS.MOSTLY_FIT,
        colorName: 'Yellow',
        hex: GW_COLOR.Yellow,
        soil_moisture_index: x,
        bandExplanation: 'Index between 0.316 and 0.321 (Mostly Fit).'
      };
    }
    if (x < 0.316) {
      return {
        status: GW_STATUS.GOOD,
        colorName: 'Green',
        hex: GW_COLOR.Green,
        soil_moisture_index: x,
        bandExplanation: 'Index below 0.316 (Good).'
      };
    }
    /* Gap 0.321 < x < 0.322 → treat as Mostly Fit; 0.326 < x ≤ 0.327 → Not Fit */
    if (x > 0.326 && x <= 0.327) {
      return {
        status: GW_STATUS.NOT_FIT,
        colorName: 'Red',
        hex: GW_COLOR.Red,
        soil_moisture_index: x,
        bandExplanation: 'Index in upper transition band (Not Fit).'
      };
    }
    return {
      status: GW_STATUS.MOSTLY_FIT,
      colorName: 'Yellow',
      hex: GW_COLOR.Yellow,
      soil_moisture_index: x,
      bandExplanation: 'Index between Mostly Fit and Marginal bands (Mostly Fit).'
    };
  }

  /** Wind (12h mph): Good 3–11 | Marginal 11–14 (exclusive of Good overlap at 11 → Good wins) | At Risk >15 or 0–2 */
  function evalWind(w) {
    var v = w;
    if (typeof v !== 'number' || Number.isNaN(v)) {
      return { key: 'wind', label: 'Wind speed (12h)', valueDisplay: '—', band: 'Marginal', detail: 'Missing wind; treated as non-Good for display only.', letter: 'M' };
    }
    if (v <= 2 || v > 15) {
      return { key: 'wind', label: 'Wind speed (12h)', valueDisplay: v + ' mph', band: 'At Risk', detail: 'Outside 3–11 mph (≤2 or >15 mph).', letter: 'A' };
    }
    if (v >= 3 && v <= 11) {
      return { key: 'wind', label: 'Wind speed (12h)', valueDisplay: v + ' mph', band: 'Good', detail: 'Within 3–11 mph.', letter: 'G' };
    }
    return { key: 'wind', label: 'Wind speed (12h)', valueDisplay: v + ' mph', band: 'Marginal', detail: 'Within 11–14 mph band (not Good, not At Risk).', letter: 'M' };
  }

  /** Daily high °F: Good 65–90 | Marginal 51–64 or 90–95 | At Risk <50 or >95 */
  function evalHighTemp(t) {
    if (typeof t !== 'number' || Number.isNaN(t)) {
      return { key: 'high', label: 'Daily high temp', valueDisplay: '—', band: 'Marginal', detail: 'Missing value.', letter: 'M' };
    }
    if (t < 50 || t > 95) {
      return { key: 'high', label: 'Daily high temp', valueDisplay: t + ' °F', band: 'At Risk', detail: 'Below 50 °F or above 95 °F.', letter: 'A' };
    }
    if (t >= 65 && t <= 90) {
      return { key: 'high', label: 'Daily high temp', valueDisplay: t + ' °F', band: 'Good', detail: 'Within 65–90 °F.', letter: 'G' };
    }
    return { key: 'high', label: 'Daily high temp', valueDisplay: t + ' °F', band: 'Marginal', detail: 'Within 51–64 °F or 90–95 °F.', letter: 'M' };
  }

  /** Daily low °F: Good ≥40 | Marginal 32–39 | At Risk ≤32 */
  function evalLowTemp(t) {
    if (typeof t !== 'number' || Number.isNaN(t)) {
      return { key: 'low', label: 'Daily low temp', valueDisplay: '—', band: 'Marginal', detail: 'Missing value.', letter: 'M' };
    }
    if (t <= 32) {
      return { key: 'low', label: 'Daily low temp', valueDisplay: t + ' °F', band: 'At Risk', detail: 'At or below 32 °F.', letter: 'A' };
    }
    if (t >= 40) {
      return { key: 'low', label: 'Daily low temp', valueDisplay: t + ' °F', band: 'Good', detail: 'At or above 40 °F.', letter: 'G' };
    }
    return { key: 'low', label: 'Daily low temp', valueDisplay: t + ' °F', band: 'Marginal', detail: 'Between 33 °F and 39 °F.', letter: 'M' };
  }

  /** Precip 24h in: Good 0.0 | Marginal 0.1–0.5 | At Risk >0.5 */
  function evalPrecip(p) {
    if (typeof p !== 'number' || Number.isNaN(p)) {
      return { key: 'precip', label: 'Precipitation (24h)', valueDisplay: '—', band: 'Marginal', detail: 'Missing value.', letter: 'M' };
    }
    if (p > 0.5) {
      return { key: 'precip', label: 'Precipitation (24h)', valueDisplay: p + ' in', band: 'At Risk', detail: 'Greater than 0.5 in.', letter: 'A' };
    }
    if (p >= 0.1 && p <= 0.5) {
      return { key: 'precip', label: 'Precipitation (24h)', valueDisplay: p + ' in', band: 'Marginal', detail: 'Between 0.1 and 0.5 in.', letter: 'M' };
    }
    return { key: 'precip', label: 'Precipitation (24h)', valueDisplay: p + ' in', band: 'Good', detail: 'Below 0.1 in.', letter: 'G' };
  }

  /** Humidity %: Good <40 | Marginal 41–59 | At Risk >60 */
  function evalHumidity(h) {
    if (typeof h !== 'number' || Number.isNaN(h)) {
      return { key: 'humidity', label: 'Humidity', valueDisplay: '—', band: 'Marginal', detail: 'Missing value.', letter: 'M' };
    }
    if (h > 60) {
      return { key: 'humidity', label: 'Humidity', valueDisplay: h + '%', band: 'At Risk', detail: 'Greater than 60%.', letter: 'A' };
    }
    if (h >= 41 && h <= 59) {
      return { key: 'humidity', label: 'Humidity', valueDisplay: h + '%', band: 'Marginal', detail: 'Between 41% and 59%.', letter: 'M' };
    }
    return { key: 'humidity', label: 'Humidity', valueDisplay: h + '%', band: 'Good', detail: 'Below 41%.', letter: 'G' };
  }

  /** AND logic: any At Risk → At Risk; else any Marginal → Marginal; else Good */
  function consolidateSprayOutlook(metricResults) {
    var letters = metricResults.map(function (m) { return m.letter; });
    if (letters.indexOf('A') >= 0) {
      return { status: SPRAY_STATUS.AT_RISK, colorName: 'At_Risk', hex: SPRAY_COLOR.At_Risk };
    }
    if (letters.indexOf('M') >= 0) {
      return { status: SPRAY_STATUS.MARGINAL, colorName: 'Marginal', hex: SPRAY_COLOR.Marginal };
    }
    return { status: SPRAY_STATUS.GOOD, colorName: 'Good', hex: SPRAY_COLOR.Good };
  }

  function sprayMetricRows(field) {
    var m = field.metrics || {
      wind_speed_12hr: field.wind_speed_12hr_mph,
      daily_high_temp: field.daily_high_temp_f,
      daily_low_temp: field.daily_low_temp_f,
      precip_24hr: field.precip_24h_in,
      humidity: field.humidity_pct
    };
    return [
      evalWind(m.wind_speed_12hr),
      evalHighTemp(m.daily_high_temp),
      evalLowTemp(m.daily_low_temp),
      evalPrecip(m.precip_24hr),
      evalHumidity(m.humidity)
    ];
  }

  function analyzeSprayOutlook(field) {
    var metrics = sprayMetricRows(field);
    var consolidated = consolidateSprayOutlook(metrics);
    var limiting = metrics.filter(function (x) { return x.band !== 'Good'; });
    return { metrics: metrics, consolidated: consolidated, limitingFactors: limiting };
  }

  function sprayStatusRank(status) {
    if (status === SPRAY_STATUS.GOOD) return 0;
    if (status === SPRAY_STATUS.MARGINAL) return 1;
    return 2;
  }

  /** Distance of high temp from Good band [65,90]; 0 if inside */
  function highTempSortDistance(high) {
    if (typeof high !== 'number' || Number.isNaN(high)) return 999;
    if (high >= 65 && high <= 90) return 0;
    if (high < 65) return 65 - high;
    return high - 90;
  }

  /** Distance of wind from Good band [3,11] */
  function windSortDistance(w) {
    if (typeof w !== 'number' || Number.isNaN(w)) return 999;
    if (w >= 3 && w <= 11) return 0;
    if (w < 3) return 3 - w;
    return w - 11;
  }

  function spraySortTuple(field) {
    var m = field.metrics || {
      wind_speed_12hr: field.wind_speed_12hr_mph,
      daily_high_temp: field.daily_high_temp_f,
      daily_low_temp: field.daily_low_temp_f,
      precip_24hr: field.precip_24h_in,
      humidity: field.humidity_pct
    };
    var analysis = analyzeSprayOutlook(field);
    var p = typeof m.precip_24hr === 'number' ? m.precip_24hr : 999;
    var hum = typeof m.humidity === 'number' ? m.humidity : 999;
    return {
      rank: sprayStatusRank(analysis.consolidated.status),
      precip: p,
      windDist: windSortDistance(m.wind_speed_12hr),
      highDist: highTempSortDistance(m.daily_high_temp),
      humidity: hum,
      fieldId: field.field_id || ''
    };
  }

  /** Deterministic spray comparator: status, then precip ↑, wind dist ↑, high dist ↑, humidity ↑, field_id */
  function compareSpraySort(a, b) {
    var ta = spraySortTuple(a);
    var tb = spraySortTuple(b);
    if (ta.rank !== tb.rank) return ta.rank - tb.rank;
    if (ta.precip !== tb.precip) return ta.precip - tb.precip;
    if (ta.windDist !== tb.windDist) return ta.windDist - tb.windDist;
    if (ta.highDist !== tb.highDist) return ta.highDist - tb.highDist;
    if (ta.humidity !== tb.humidity) return ta.humidity - tb.humidity;
    return ta.fieldId.localeCompare(tb.fieldId);
  }

  function compareWorkabilityIndex(a, b, desc) {
    var xa = typeof a.soil_moisture_index === 'number' ? a.soil_moisture_index : (a.soil_moisture_index == null ? NaN : Number(a.soil_moisture_index));
    var xb = typeof b.soil_moisture_index === 'number' ? b.soil_moisture_index : (b.soil_moisture_index == null ? NaN : Number(b.soil_moisture_index));
    var na = Number.isNaN(xa);
    var nb = Number.isNaN(xb);
    if (na && nb) return (a.field_id || '').localeCompare(b.field_id || '');
    if (na) return 1;
    if (nb) return -1;
    var cmp = desc ? xb - xa : xa - xb;
    if (cmp !== 0) return cmp;
    return (a.field_id || '').localeCompare(b.field_id || '');
  }

  /**
   * Rich HTML for web tooltip + mobile sheet (Ground workability).
   * Compact: one status row, non-redundant band line, single footer.
   */
  function buildWorkabilityDetailHTML(gw, lastUpdated) {
    var idx = typeof gw.soil_moisture_index === 'number' ? gw.soil_moisture_index.toFixed(3) : '—';
    var bandLine = bandExplanationCompact(gw.bandExplanation, gw.status);
    var parts = [];
    parts.push('<div class="gw-so-detail gw-so-detail--gw gw-so-detail--compact">');
    parts.push('<div class="gw-so-detail__brand">Ground workability</div>');
    parts.push('<div class="gw-so-compact-head">');
    parts.push('<span class="gw-so-detail__swatch gw-so-detail__swatch--compact" style="background-color:' + escHtml(gw.hex) + '" aria-hidden="true"></span>');
    parts.push('<div class="gw-so-compact-head__text">');
    parts.push('<span class="gw-so-detail__status gw-so-detail__status--compact" style="color:' + escHtml(gw.hex) + '">' + escHtml(gw.status) + '</span>');
    parts.push('<span class="gw-so-compact-inline-meta">SMI ' + escHtml(idx) + '</span>');
    parts.push('</div></div>');
    if (bandLine) {
      parts.push('<p class="gw-so-fact gw-so-fact--compact">' + escHtml(bandLine) + '</p>');
    }
    parts.push('<p class="gw-so-foot">IBM soil moisture index');
    if (lastUpdated) {
      parts.push(' · ' + formatUpdated(lastUpdated));
    }
    parts.push('</p>');
    parts.push('</div>');
    return parts.join('');
  }

  /**
   * Rich HTML for web tooltip + mobile sheet (Spray outlook).
   * Compact: consolidated status; full rows only for non-Good metrics; Good summarized in one line.
   */
  function buildSprayDetailHTML(analysis, lastUpdated) {
    var c = analysis.consolidated;
    var metrics = analysis.metrics;
    var bad = metrics.filter(function (m) {
      return m.band !== 'Good';
    });
    var good = metrics.filter(function (m) {
      return m.band === 'Good';
    });
    var parts = [];
    parts.push('<div class="gw-so-detail gw-so-detail--spray gw-so-detail--compact">');
    parts.push('<div class="gw-so-detail__brand">Spray outlook</div>');
    parts.push('<div class="gw-so-compact-head">');
    parts.push('<span class="gw-so-detail__swatch gw-so-detail__swatch--compact" style="background-color:' + escHtml(c.hex) + '" aria-hidden="true"></span>');
    parts.push('<div class="gw-so-compact-head__text">');
    parts.push('<span class="gw-so-detail__status gw-so-detail__status--compact" style="color:' + escHtml(c.hex) + '">' + escHtml(c.status) + '</span>');
    parts.push('<span class="gw-so-compact-inline-meta">AND across 5 metrics</span>');
    parts.push('</div></div>');

    if (good.length > 0) {
      parts.push(
        '<p class="gw-so-compact-good" role="status"><span class="gw-so-compact-good__k">OK:</span> ' +
          escHtml(good.map(metricShortName).join(', ')) +
          '</p>'
      );
    }

    if (bad.length > 0) {
      parts.push('<ul class="gw-so-metric-list gw-so-metric-list--compact">');
      bad.forEach(function (m) {
        var mod = sprayPillModifier(m.band);
        var riskMod = m.band === 'At Risk' ? ' gw-so-metric--risk' : '';
        parts.push('<li class="gw-so-metric gw-so-metric--compact gw-so-metric--limiting' + riskMod + '">');
        parts.push('<div class="gw-so-metric__row gw-so-metric__row--compact">');
        parts.push('<span class="gw-so-metric__label">' + escHtml(m.label) + '</span>');
        parts.push('<span class="gw-so-metric__value">' + escHtml(m.valueDisplay) + '</span>');
        parts.push('<span class="gw-so-pill gw-so-pill--compact gw-so-pill--' + mod + '">' + escHtml(m.band) + '</span>');
        parts.push('</div>');
        parts.push('<p class="gw-so-metric__detail gw-so-metric__detail--compact">' + escHtml(m.detail) + '</p>');
        parts.push('</li>');
      });
      parts.push('</ul>');
    } else {
      parts.push('<p class="gw-so-compact-all-good" role="status">All five metrics are Good.</p>');
    }

    parts.push('<p class="gw-so-foot">Wind 12h · daily high/low · 24h precip · humidity');
    if (lastUpdated) {
      parts.push(' · ' + formatUpdated(lastUpdated));
    }
    parts.push('</p>');
    parts.push('</div>');
    return parts.join('');
  }

  /**
   * List/table view: stacked horizontal segments (rounded), inactive = light grey, active = status color from bottom.
   * GW: 4 bars — Good 1, Mostly Fit 2, Marginal 3, Not Fit 4. Spray: 3 bars — Good 1, Marginal 2, At Risk 1.
   */
  var LIST_VIEW_BAR_INACTIVE = '#eceff4';

  function listViewBarStackHTML(barCount, filledFromBottom, activeHex) {
    var n = typeof barCount === 'number' ? barCount : 0;
    var f = typeof filledFromBottom === 'number' ? filledFromBottom : 0;
    if (f < 0) f = 0;
    if (f > n) f = n;
    var inactive = LIST_VIEW_BAR_INACTIVE;
    var hx = activeHex || '#9ca3af';
    var parts = ['<div class="weather-list-status-bars" data-bar-count="' + n + '" aria-hidden="true">'];
    for (var i = 0; i < n; i++) {
      var active = i >= n - f;
      var bg = active ? hx : inactive;
      parts.push('<span class="weather-list-status-bars__seg" style="background:' + escHtml(bg) + '"></span>');
    }
    parts.push('</div>');
    return parts.join('');
  }

  function listViewGwBarStackHTML(gw) {
    var filled = 0;
    if (gw.status === GW_STATUS.GOOD) filled = 1;
    else if (gw.status === GW_STATUS.MOSTLY_FIT) filled = 2;
    else if (gw.status === GW_STATUS.MARGINAL) filled = 3;
    else if (gw.status === GW_STATUS.NOT_FIT) filled = 4;
    return listViewBarStackHTML(4, filled, gw.hex);
  }

  function listViewSprayBarStackHTML(consolidated) {
    var filled = 0;
    if (consolidated.status === SPRAY_STATUS.GOOD) filled = 1;
    else if (consolidated.status === SPRAY_STATUS.MARGINAL) filled = 2;
    else if (consolidated.status === SPRAY_STATUS.AT_RISK) filled = 1;
    return listViewBarStackHTML(3, filled, consolidated.hex);
  }

  var FIELD_CLICK_STACK_INACTIVE = '#e8eaed';

  /**
   * Footer line for map field sheet: latest of GW/SO update times, formatted in US Eastern.
   */
  function formatWeatherDataCollectedFooterET(field) {
    var gw = field.ground_workability_last_updated;
    var sp = field.spray_outlook_last_updated;
    var iso = null;
    if (gw && sp) {
      iso = new Date(gw).getTime() >= new Date(sp).getTime() ? gw : sp;
    } else {
      iso = gw || sp;
    }
    if (!iso) {
      return escHtml('Weather data collected');
    }
    try {
      var d = new Date(iso);
      if (Number.isNaN(d.getTime())) return escHtml('Weather data collected');
      var t = d.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      t = t.replace(/\s/g, '').toLowerCase();
      return escHtml('Weather data collected at ' + t + ' ET');
    } catch (e) {
      return escHtml('Weather data collected');
    }
  }

  function fieldClickThreeBarStack(activeHex) {
    var inact = FIELD_CLICK_STACK_INACTIVE;
    return (
      '<div class="weather-field-click-gwso__stack" aria-hidden="true">' +
      '<span class="weather-field-click-gwso__stack-bar" style="background:' +
      escHtml(inact) +
      '"></span>' +
      '<span class="weather-field-click-gwso__stack-bar" style="background:' +
      escHtml(inact) +
      '"></span>' +
      '<span class="weather-field-click-gwso__stack-bar weather-field-click-gwso__stack-bar--active" style="background:' +
      escHtml(activeHex) +
      '"></span>' +
      '</div>'
    );
  }

  /**
   * Map field tap (bottom sheet body): two columns — ground workability | spray outlook —
   * with three-bar stack + bold status (reference UI). Footer: weather collected time ET.
   */
  function buildMapFieldGwSoClickSheetHTML(field) {
    if (!field) return '';
    var gw = classifyGroundWorkability(field.soil_moisture_index);
    var sp = analyzeSprayOutlook(field).consolidated;
    var parts = [];
    parts.push('<div class="weather-field-click-gwso">');
    parts.push('<div class="weather-field-click-gwso__cols">');

    parts.push('<div class="weather-field-click-gwso__col">');
    parts.push('<div class="weather-field-click-gwso__heading">Ground workability</div>');
    parts.push('<div class="weather-field-click-gwso__status-row">');
    parts.push(fieldClickThreeBarStack(gw.hex));
    parts.push('<span class="weather-field-click-gwso__status-text">' + escHtml(gw.status) + '</span>');
    parts.push('</div></div>');

    parts.push('<div class="weather-field-click-gwso__col">');
    parts.push('<div class="weather-field-click-gwso__heading">Spray outlook</div>');
    parts.push('<div class="weather-field-click-gwso__status-row">');
    parts.push(fieldClickThreeBarStack(sp.hex));
    parts.push('<span class="weather-field-click-gwso__status-text">' + escHtml(sp.status) + '</span>');
    parts.push('</div></div>');

    parts.push('</div>');
    parts.push('<p class="weather-field-click-gwso__footer">' + formatWeatherDataCollectedFooterET(field) + '</p>');
    parts.push('</div>');
    return parts.join('');
  }

  /**
   * Map-style tooltip only: color bar + status word (+ tiny GW/SO labels). No SMI, bands, metric rows, or footers.
   */
  function buildWorkabilityMinimalHTML(gw) {
    var parts = [];
    parts.push('<div class="gw-so-detail gw-so-detail--gw gw-so-detail--mini">');
    parts.push('<div class="gw-so-mini-row">');
    parts.push('<span class="gw-so-mini-kind">GW</span>');
    parts.push(
      '<span class="gw-so-detail__swatch gw-so-detail__swatch--mini" style="background-color:' +
        escHtml(gw.hex) +
        '" aria-hidden="true"></span>'
    );
    parts.push(
      '<span class="gw-so-detail__status gw-so-detail__status--mini" style="color:' +
        escHtml(gw.hex) +
        '">' +
        escHtml(gw.status) +
        '</span>'
    );
    parts.push('</div></div>');
    return parts.join('');
  }

  function buildSprayMinimalHTML(analysis) {
    var c = analysis.consolidated;
    var parts = [];
    parts.push('<div class="gw-so-detail gw-so-detail--spray gw-so-detail--mini">');
    parts.push('<div class="gw-so-mini-row">');
    parts.push('<span class="gw-so-mini-kind">SO</span>');
    parts.push(
      '<span class="gw-so-detail__swatch gw-so-detail__swatch--mini" style="background-color:' +
        escHtml(c.hex) +
        '" aria-hidden="true"></span>'
    );
    parts.push(
      '<span class="gw-so-detail__status gw-so-detail__status--mini" style="color:' +
        escHtml(c.hex) +
        '">' +
        escHtml(c.status) +
        '</span>'
    );
    parts.push('</div></div>');
    return parts.join('');
  }

  function buildWorkabilityTooltip(gw, lastUpdated) {
    return buildWorkabilityDetailHTML(gw, lastUpdated);
  }

  function buildSprayTooltip(analysis, lastUpdated) {
    return buildSprayDetailHTML(analysis, lastUpdated);
  }

  var api = {
    GW_STATUS: GW_STATUS,
    SPRAY_STATUS: SPRAY_STATUS,
    classifyGroundWorkability: classifyGroundWorkability,
    analyzeSprayOutlook: analyzeSprayOutlook,
    consolidateSprayOutlook: consolidateSprayOutlook,
    sprayMetricRows: sprayMetricRows,
    compareSpraySort: compareSpraySort,
    compareWorkabilityIndex: compareWorkabilityIndex,
    spraySortTuple: spraySortTuple,
    buildWorkabilityTooltip: buildWorkabilityTooltip,
    buildSprayTooltip: buildSprayTooltip,
    buildWorkabilityDetailHTML: buildWorkabilityDetailHTML,
    buildSprayDetailHTML: buildSprayDetailHTML,
    buildWorkabilityMinimalHTML: buildWorkabilityMinimalHTML,
    buildSprayMinimalHTML: buildSprayMinimalHTML,
    buildMapFieldGwSoClickSheetHTML: buildMapFieldGwSoClickSheetHTML,
    listViewGwBarStackHTML: listViewGwBarStackHTML,
    listViewSprayBarStackHTML: listViewSprayBarStackHTML
  };

  global.WeatherGroundSprayLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
