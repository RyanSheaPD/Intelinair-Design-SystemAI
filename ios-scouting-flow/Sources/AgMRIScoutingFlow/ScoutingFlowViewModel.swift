import CoreLocation
import Foundation
import MapKit
import Observation

public enum ComposerSheetStep: Sendable {
    case category
    case tissueForm
    case genericForm
}

@Observable
public final class ScoutingFlowViewModel {
    // Map + tools
    public var region: MKCoordinateRegion
    public var isToolMenuPresented = false
    public var isPinPlacementArmed = false

    // Composer
    public var isNewLocationSheetPresented = false
    public var sheetStep: ComposerSheetStep = .category
    public var selectedCategory: IssueCategory?
    public var draftCoordinate: CLLocationCoordinate2D?
    public var draftPinId: UUID?

    // Tissue form
    public var treatmentZones: [TreatmentZoneOption] = [
        TreatmentZoneOption(id: "tz_n", name: "North — VR Nitrogen"),
        TreatmentZoneOption(id: "tz_s", name: "South — Standard rate"),
        TreatmentZoneOption(id: "tz_e", name: "East — Check strip"),
    ]
    public var treatmentZoneId: String?
    public var barcode: String = ""
    public var barcodeSource: BarcodeSource = .none
    public var notes: String = ""
    public var growthStage: String?
    public static let growthStages = ["V6", "V10", "VT", "R1", "R2", "R3", "R4", "R5", "R6"]
    public var mediaCount = 0

    public var isBarcodeScannerPresented = false
    public var isSaving = false
    public var saveErrorMessage: String?

    public var pins: [ScoutingPin] = []

    // Report
    public var reportPin: ScoutingPin?
    public var isReportPresented = false

    // Discard
    public var pendingDismissComposer = false
    public var showDiscardConfirmation = false

    public init() {
        let center = CLLocationCoordinate2D(latitude: 40.428, longitude: -86.914)
        region = MKCoordinateRegion(
            center: center,
            span: MKCoordinateSpan(latitudeDelta: 0.018, longitudeDelta: 0.018)
        )
        seedMapIfEmpty()
    }

    private func seedMapIfEmpty() {
        guard pins.isEmpty else { return }
        let c = region.center
        pins.append(
            ScoutingPin(
                coordinate: CLLocationCoordinate2D(latitude: c.latitude + 0.002, longitude: c.longitude - 0.003),
                category: .disease,
                label: "Disease",
                lifecycle: .saved,
                treatmentZoneName: "North — VR Nitrogen",
                barcode: nil,
                notes: "Northern edge, light lesions.",
                growthStage: "R3",
                trialId: "TRL-2026-014",
                protocolName: "Fungicide timing",
                mediaAttachmentCount: 1
            )
        )
    }

    // MARK: - Derived

    public var formIsDirty: Bool {
        selectedCategory != nil
            || treatmentZoneId != nil
            || !barcode.isEmpty
            || !notes.isEmpty
            || growthStage != nil
            || mediaCount > 0
    }

    /// Tissue Test: category + treatment zone required before save.
    public var canSaveTissueForm: Bool {
        guard selectedCategory == .tissueTest else { return false }
        guard treatmentZoneId != nil else { return false }
        if isSaving { return false }
        return true
    }

    /// Other categories: category only (fast capture).
    public var canSaveGenericForm: Bool {
        guard selectedCategory != nil, selectedCategory != .tissueTest else { return false }
        if isSaving { return false }
        return true
    }

    public var canSaveCurrentStep: Bool {
        switch sheetStep {
        case .tissueForm: return canSaveTissueForm
        case .genericForm: return canSaveGenericForm
        case .category: return false
        }
    }

    public var canContinueFromCategory: Bool {
        selectedCategory != nil
    }

    public var selectedZoneName: String? {
        guard let id = treatmentZoneId else { return nil }
        return treatmentZones.first { $0.id == id }?.name
    }

    // MARK: - Actions

    public func openToolMenu() {
        isToolMenuPresented = true
    }

    public func selectPinTool() {
        isToolMenuPresented = false
        isPinPlacementArmed = true
    }

    public func cancelPinPlacement() {
        isPinPlacementArmed = false
    }

    public func mapTapped(at coordinate: CLLocationCoordinate2D) {
        guard isPinPlacementArmed else { return }
        isPinPlacementArmed = false
        draftCoordinate = coordinate
        draftPinId = UUID()
        resetComposerForNewPin()
        sheetStep = .category
        isNewLocationSheetPresented = true
    }

    public func resetComposerForNewPin() {
        selectedCategory = nil
        treatmentZoneId = nil
        barcode = ""
        barcodeSource = .none
        notes = ""
        growthStage = nil
        mediaCount = 0
        saveErrorMessage = nil
    }

    public func continueFromCategory() {
        guard let cat = selectedCategory else { return }
        if cat == .tissueTest {
            sheetStep = .tissueForm
        } else {
            sheetStep = .genericForm
            treatmentZoneId = nil
        }
    }

    public func changeCategoryFromForm() {
        sheetStep = .category
    }

    public func requestDismissComposer() {
        if formIsDirty {
            showDiscardConfirmation = true
        } else {
            dismissComposerDiscarding()
        }
    }

    public func dismissComposerDiscarding() {
        showDiscardConfirmation = false
        isNewLocationSheetPresented = false
        draftCoordinate = nil
        draftPinId = nil
        resetComposerForNewPin()
        sheetStep = .category
    }

    public func dismissComposerKeepEditing() {
        showDiscardConfirmation = false
    }

    public func deleteDraftPin() {
        dismissComposerDiscarding()
    }

    public func simulateBarcodeScanned(_ value: String) {
        barcode = value
        barcodeSource = .scan
        isBarcodeScannerPresented = false
    }

    public func addMedia() {
        mediaCount = min(mediaCount + 1, 8)
    }

    public func removeMediaSlot() {
        mediaCount = max(mediaCount - 1, 0)
    }

    public func saveAnnotation() async {
        guard canSaveCurrentStep, let coord = draftCoordinate, let cat = selectedCategory else { return }
        isSaving = true
        saveErrorMessage = nil
        try? await Task.sleep(nanoseconds: 450_000_000)
        isSaving = false

        let zoneName = selectedZoneName ?? "Field"
        let label: String
        if cat == .tissueTest {
            if barcode.isEmpty {
                label = "Tissue test"
            } else {
                let short = barcode.count > 10 ? String(barcode.prefix(10)) + "…" : barcode
                label = "Tissue · \(short)"
            }
        } else {
            label = cat.rawValue
        }

        let lifecycle: PinLifecycle = cat == .tissueTest ? .pendingReview : .saved
        let newPin = ScoutingPin(
            id: draftPinId ?? UUID(),
            coordinate: coord,
            category: cat,
            label: String(label.prefix(28)),
            lifecycle: lifecycle,
            treatmentZoneName: cat == .tissueTest ? zoneName : "—",
            barcode: barcode.isEmpty ? nil : barcode,
            notes: notes,
            growthStage: growthStage,
            mediaAttachmentCount: mediaCount
        )
        pins.append(newPin)
        isNewLocationSheetPresented = false
        draftCoordinate = nil
        draftPinId = nil
        resetComposerForNewPin()
        sheetStep = .category
    }

    public func openReport(for pin: ScoutingPin) {
        reportPin = pin
        isReportPresented = true
    }

    public func dismissReport() {
        isReportPresented = false
        reportPin = nil
    }
}
