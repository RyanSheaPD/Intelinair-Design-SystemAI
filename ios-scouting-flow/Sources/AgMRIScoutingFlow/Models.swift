import CoreLocation
import Foundation

public enum IssueCategory: String, CaseIterable, Identifiable, Sendable {
    case tissueTest = "Tissue Test"
    case disease = "Disease"
    case weeds = "Weeds"
    case insects = "Insects"
    case other = "Other"

    public var id: String { rawValue }

    var systemImage: String {
        switch self {
        case .tissueTest: return "leaf.fill"
        case .disease: return "cross.case.fill"
        case .weeds: return "leaf.circle.fill"
        case .insects: return "ant.fill"
        case .other: return "ellipsis.circle.fill"
        }
    }
}

public enum BarcodeSource: Sendable {
    case none
    case scan
    case manual
}

public enum PinLifecycle: Sendable {
    case draft
    case pendingReview
    case saved
}

public struct ScoutingPin: Identifiable, Equatable, Sendable {
    public let id: UUID
    public var coordinate: CLLocationCoordinate2D
    public var category: IssueCategory
    public var label: String
    public var lifecycle: PinLifecycle
    public var treatmentZoneName: String
    public var barcode: String?
    public var notes: String
    public var growthStage: String?
    public var trialId: String?
    public var protocolName: String?
    public var mediaAttachmentCount: Int

    public init(
        id: UUID = UUID(),
        coordinate: CLLocationCoordinate2D,
        category: IssueCategory,
        label: String,
        lifecycle: PinLifecycle,
        treatmentZoneName: String,
        barcode: String?,
        notes: String,
        growthStage: String?,
        trialId: String? = "TRL-2026-014",
        protocolName: String? = "N Response — Block A",
        mediaAttachmentCount: Int = 0
    ) {
        self.id = id
        self.coordinate = coordinate
        self.category = category
        self.label = label
        self.lifecycle = lifecycle
        self.treatmentZoneName = treatmentZoneName
        self.barcode = barcode
        self.notes = notes
        self.growthStage = growthStage
        self.trialId = trialId
        self.protocolName = protocolName
        self.mediaAttachmentCount = mediaAttachmentCount
    }
}

public struct TreatmentZoneOption: Identifiable, Hashable, Sendable {
    public let id: String
    public let name: String

    public init(id: String, name: String) {
        self.id = id
        self.name = name
    }
}
