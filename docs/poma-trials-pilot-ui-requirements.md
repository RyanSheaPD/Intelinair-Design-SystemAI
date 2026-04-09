# UI design requirements — POMA trials / pilot integration

**Feature:** POMA Trials/Pilot Integration (Suspicion Map + Scouting Image Analysis)  
**Epic:** APRC-278  
**Target release:** May 2026  
**Document status:** DRAFT  
**Document owner:** @Caleb Wieber  

This document captures **UI design requirements** for integrating Applicolor POMA capabilities into AGMRI Virtual Scout and scouting workflows. Use it alongside [DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md) for tokens, components, and accessibility principles.

**Static UI demo:** [pages/poma-pilot-ui-demo.html](../pages/poma-pilot-ui-demo.html) (open in a browser from the repo root).

---

## 1. Problem / goal (why)

Scouts and crop specialists currently must walk entire fields to identify disease pressure, which is time-consuming, costly, and often too late for early intervention. POMA (by Applicolor) detects biological fingerprints of disease before visible symptoms appear using image-based analysis.

This UI enables scouts to:

- **Know where to scout before entering a field** (Suspicion Map).
- **Submit leaf images and receive near real-time processed results** confirming or flagging disease presence while still in the field (Scouting Image Analysis).

Both capabilities surface inside existing AGMRI Virtual Scout workflows, keeping the experience familiar while adding meaningful early-detection value.

---

## 2. Actors

| Role | Responsibility |
|------|----------------|
| **Primary: Field Scout** | Captures images, views suspicion maps, acts on results in the field. |
| **Secondary: Crop Specialist / Agronomist** | Reviews suspicion maps and processed results to guide scouting strategy and reporting. |

---

## 3. Entry points

- **Virtual Scout** — Suspicion Map layer and POMA badge on subscribed fields.
- **Scouting Pin (Create / Edit)** — Entry point for submitting leaf images under the Enhanced Disease Detection category.
- **Notifications Panel (Web)** — Deep-link to scouting pin when results are ready.
- **iOS Push Notification** — Deep-link to scouting pin when results are ready.

---

## 4. Triggers

| Trigger | Description |
|---------|-------------|
| **User** | Scout creates or edits a scouting pin and selects the Enhanced Disease Detection category. |
| **User** | Scout uploads one or more leaf images within the pin. |
| **System** | A subscribed field receives a new imagery capture that meets the minimum GDD threshold → triggers Suspicion Map generation. |
| **System** | Applicolor returns processed images → triggers notification to user and status update on scouting pin. |
| **System** | Applicolor returns a completed Suspicion Map → triggers POMA badge display and map layer availability in Virtual Scout. |

---

## 5. Core entities / data

```json
{
  "field": {
    "subscription_status": "Boolean — determines POMA eligibility",
    "poma_badge_visible": "Boolean — true when Suspicion Map is available",
    "gdd_threshold_met": "Boolean — triggers map generation (threshold value TBD)"
  },
  "suspicion_map": {
    "status": ["Processing", "Completed", "Failed"],
    "completed_timestamp": "ISO datetime",
    "layer_type": "Raster TIFF for pilot (vector-based approach future consideration)",
    "annotation_style": "Crosshair markers — density indicates suspicion level"
  },
  "scouting_pin": {
    "category": "Enhanced Disease Detection (name TBD)",
    "status": ["Pending", "Processing", "Results Available", "Unable to Process"],
    "optional_inputs": {
      "notes": "Free text",
      "best_guess_disease": "Free text or enumerated list (TBD)",
      "leaf_position": "Free text or structured (TBD)"
    }
  },
  "leaf_image": {
    "original_image": "Preserved — never discarded",
    "processed_image": "Returned by Applicolor — highlights disease areas with X markers",
    "poma_result": ["Yes", "No", "Maybe"]
  }
}
```

---

## 6. Functional requirements (what)

### 6.1 Suspicion Map layer (Virtual Scout)

- Fields with an available Suspicion Map display a **POMA badge** in list, thumbnail, and map views.
- The POMA badge acts as a **filterable attribute** across all views.
- Selecting a badged field in Virtual Scout exposes a **POMA Suspicion Map layer toggle**.
- The layer renders as a heat map using **crosshair annotations** — higher marker density = higher suspicion.
- The map is labeled **"POMA Suspicion Map"** with a visible tooltip or info icon explaining: *"This map highlights areas where early disease signal may be present. Ground scouting is required to confirm."*
- **No field-level numerical score** is displayed during pilot.
- Layer displays the **completed timestamp** (consistent with existing timeline item metadata).

### 6.2 Scouting pin — image submission (Enhanced Disease Detection)

- Scout creates or edits a scouting pin and selects **Enhanced Disease Detection** as the category.
- Within the category, scout uploads **one or more leaf images**.
- **Image capture guidance** is displayed using the same **"i" tooltip pattern** as the PivotBio scouting implementation:
  - Capture in shade or with back to the sun.
  - Center suspected lesions in frame.
  - Capture approximately 4–6 inches of leaf.
  - Take multiple images if multiple infection sites exist.
  - Optionally capture a wider stalk image for context.
- **Optional fields:** Notes, Best-guess disease, Leaf position.
- Pin displays a **status indicator** (Pending → Processing → Results Available / Unable to Process).

### 6.3 Scouting pin — results display

When results are returned by Applicolor, the scouting pin displays:

- **Original image and processed image side-by-side.**
- Processed image uses **X markers** to call out areas of concern.
- A **Yes / No / Maybe** result indicator from POMA.
- The **original image is always preserved** — it must never be replaced or discarded.
- The results layout **reuses existing scouting pin UI patterns** to avoid introducing a new "result object" users must learn.

### 6.4 Notifications

- **iOS:** Push notification — *"Images have been processed for disease detection in [Field Name]"* — deep-links to the scouting pin.
- **Web:** Notification in the Notifications panel — same copy and deep-link behavior.
- Notifications fire when **scouting pin processed images are ready**.

### 6.5 Data rules

- Suspicion Maps are only generated for **subscribed fields** that meet the **GDD threshold**.
- **Image processing** occurs entirely on Applicolor infrastructure — AGMRI does not perform disease analysis.
- AGMRI is responsible for **securely transmitting** images to Applicolor and **displaying** returned results.
- Applicolor only accesses fields **explicitly shared** for processing and data required for suspicion maps and scouting analysis — no harvest data or broad access.
- **Original images** must be retained and stored **independently** of processed images.

---

## 7. States

### 7.1 Global states

| State | Meaning |
|-------|---------|
| **Loading** | Data fetch or processing in progress. |
| **Data Available** | All expected data returned and displayable. |
| **Partial Data** | Some data available (e.g., map generated but image results pending). |
| **No Data** | Field not subscribed, GDD threshold not met, or no images submitted. |
| **Error** | Processing failed on Applicolor side or connectivity issue. |

### 7.2 Suspicion Map states

| State | Meaning |
|-------|---------|
| **Loading** | Imagery received, map generation in progress. |
| **Completed** | Map layer available with timestamp. |
| **Failed** | Generation failed; display retry option or support path. |
| **Not Yet Generated** | Field is subscribed but GDD threshold not yet met; badge not shown. |
| **Not Eligible** | Field is not subscribed; no badge or layer shown. |

### 7.3 Scouting pin states

| State | Meaning |
|-------|---------|
| **Pending** | Images uploaded, awaiting pickup by Applicolor. |
| **Processing** | Applicolor is actively analyzing images. |
| **Results Available** | Processed images and Yes/No/Maybe result returned and displayed. |
| **Unable to Process** | Applicolor could not analyze image(s); display reason and resubmission guidance. |
| **No Images Submitted** | Category selected but no images uploaded yet. |

### 7.4 Data boundary states

- **Connectivity loss in field** — scout submits image without internet; behavior TBD (queue and send when reconnected vs. hard failure).
- **GDD threshold transition** — field crosses threshold mid-season; map generation should trigger on next qualifying imagery capture.
- **Partial image set** — some images in a pin processed successfully, others failed; must clearly distinguish **per-image status**.
- **Result delay** — processing takes longer than expected; pin should not appear stuck without **user-visible feedback**.

---

## 8. User actions

- **Browse** — view fields in list, thumbnail, or map view; filter by POMA badge presence.
- **Toggle layer** — enable/disable Suspicion Map overlay in Virtual Scout.
- **Create/Edit pin** — initiate image submission via Enhanced Disease Detection category.
- **Upload images** — attach one or more leaf images to a scouting pin.
- **View results** — open scouting pin to see side-by-side original and processed images with Yes/No/Maybe result.
- **Navigate via notification** — tap push or web notification to deep-link directly to relevant scouting pin.

---

## 9. Edge cases

- Field subscribed but **GDD threshold not met** — badge should not appear; map generation should not trigger prematurely.
- **No internet connectivity** in field — scout cannot receive real-time results; app must communicate clearly that results will be delivered when connectivity is restored (behavior and queuing logic TBD).
- **Image quality too low** for processing — Applicolor returns "Unable to Process"; UI must surface reason and allow resubmission **without losing the original image**.
- **Multiple images in one pin with mixed results** — some processed successfully, some failed; per-image status must be individually surfaced.
- **Processed image returned but original accidentally overwritten** — original must be stored independently; enforced at the data layer.
- **Notification delivered but pin no longer accessible** — deep-link must gracefully handle deleted or inaccessible pins.
- **Applicolor processing delay** — pin must not appear stuck; visible "processing" state with elapsed time or expected window should be shown.
- Scout submits images **outside of a subscribed field** — behavior TBD; should the category be available for non-subscribed fields?
- **GDD threshold changes mid-pilot** — retroactive map generation behavior is undefined and must be addressed.

---

## 10. UI / design system constraints

- **No color-only meaning** — suspicion level on the map must use **shape/density** (crosshair markers) in addition to color for accessibility.
- **Familiar patterns first** — results display within scouting pin should reuse existing pin UI; no new "result object" paradigm for pilot.
- **Image guidance tooltip** — must follow the exact **PivotBio "i" tooltip** implementation pattern.
- **Voice/tone** — progression should follow: **Detect → Investigate → Act**; avoid clinical or alarmist language.
- **POMA badge** — visually distinct from other field badges but consistent with the **existing badge design system**.
- **Side-by-side image layout** — original and processed images must be **clearly labeled** to avoid confusion.

---

## 11. Platform constraints

| Platform | Requirements |
|----------|----------------|
| **Desktop (Web)** | Full Suspicion Map layer interaction; Notifications panel for result alerts; side-by-side image display in scouting pin. |
| **Tablet** | Virtual Scout map interaction and scouting pin access; responsive layout for side-by-side image view. |
| **Mobile (iOS primary)** | Real-time push notifications; in-field image capture and upload; scouting pin result view optimized for **one-handed, outdoor use** (sunlight readability, large tap targets). |

---

## 12. Acceptance criteria

- [ ] Fields with a Suspicion Map display a POMA badge in list, thumbnail, and map views.
- [ ] POMA badge can be used to filter fields across all views.
- [ ] Suspicion Map layer is toggleable within Virtual Scout for eligible fields.
- [ ] Suspicion Map displays crosshair annotations with density indicating suspicion level.
- [ ] Map is labeled "POMA Suspicion Map" with a visible tooltip explaining its limitations.
- [ ] No field-level numerical score is displayed.
- [ ] Scout can select Enhanced Disease Detection category when creating or editing a scouting pin.
- [ ] Image capture guidance is displayed via "i" tooltip following PivotBio pattern.
- [ ] Scout can upload one or more leaf images with optional notes, disease guess, and leaf position.
- [ ] Scouting pin displays Pending → Processing → Results Available status progression.
- [ ] Processed and original images are displayed side-by-side within the scouting pin.
- [ ] Original image is never replaced or removed when processed image is returned.
- [ ] Yes / No / Maybe POMA result is clearly displayed on the pin.
- [ ] "Unable to Process" state surfaces a reason and resubmission path.
- [ ] iOS push notification fires when results are ready and deep-links to the correct pin.
- [ ] Web notification fires when results are ready and deep-links to the correct pin.
- [ ] Non-subscribed fields do not display POMA badge or map layer.
- [ ] Fields that have not met GDD threshold do not trigger map generation.

---

## 13. Outstanding decisions (blockers)

- [ ] **GDD threshold value** — final threshold and any crop-specific logic not yet defined; needed before map generation trigger can be implemented.
- [ ] **Real-time delivery architecture** — Alan (Applicolor) confirmed goal is results while scout is still next to the plant; unknown technical challenges expected — queuing, retry logic, and degraded-connectivity behavior need to be defined jointly between Applicolor and Intelinair dev team.
- [ ] **Offline / no-connectivity behavior** — what happens when a scout submits images without internet? Queue and deliver later, or surface a hard failure? UX and backend approach TBD.
- [ ] **Subscription gating source of truth** — is eligibility determined by CRM, account config, or a field-level flag? Must be resolved before badge and map generation logic can be built.
- [ ] **Suspicion Map format** — raster TIFF confirmed for pilot; long-term vector-based approach implications need architectural review before pilot scales.
- [ ] **Enhanced Disease Detection category name** — "Enhanced Disease Detection" is a placeholder; a snappier name is desired before release.
- [ ] **Trial methodology finalization** — Alan's proposed protocol (10–20 images, scouts circling lesions, periodic follow-up visits, Govee sensor data) is not yet firmed up; Intelinair and Applicolor need to align on this before pilot farms are onboarded.
- [ ] **Follow-up visit cadence** — how frequently can scouts realistically return to marked plants? Affects how trial validation data is collected and documented in AGMRI.
- [ ] **Govee sensor integration** — Alan proposed $20 Govee temp/humidity/moisture recorders at each farm; is AGMRI expected to ingest or display this data, or is it managed externally by Applicolor?
- [ ] **Non-subscribed field behavior** — should the Enhanced Disease Detection scouting category be hidden, greyed out, or available (without POMA processing) for non-subscribed fields?
- [ ] **Problem ticket / support procedure** — Applicolor and Intelinair are developing this jointly; needs to be defined before pilot launch so scouts have a clear escalation path.
- [ ] **Phone support hours for Applicolor** — Alan indicated support will not be 24/7 but must be "fairly immediate" during pilot; SLA needs to be documented.
- [ ] **Pilot farm count and rollout sequence** — starting small and expanding; who determines readiness to add additional farms, and what are the go/no-go criteria?
- [ ] **Best-guess disease field** — should this be free text or a constrained enumerated list? If enumerated, what are the values for pilot?
- [ ] **Leaf position field** — free text or structured input? Does Applicolor use this data in their analysis?

---

*DRAFT — align with engineering and product as blockers close.*
