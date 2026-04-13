import SwiftUI

/// Read-only report with pending-review banner and trial metadata.
public struct ScoutingReportDetailView: View {
    public let pin: ScoutingPin
    public let onDismiss: () -> Void

    public init(pin: ScoutingPin, onDismiss: @escaping () -> Void) {
        self.pin = pin
        self.onDismiss = onDismiss
    }

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: ScoutingTheme.spacingL) {
                    ReportStatusBanner(lifecycle: pin.lifecycle, category: pin.category)

                    fieldGrowerCard

                    TrialMetadataCard(
                        trialId: pin.trialId,
                        protocolName: pin.protocolName,
                        zoneName: pin.treatmentZoneName
                    )

                    MediaCarouselPlaceholder(count: pin.mediaAttachmentCount)

                    keyValueSection(title: "Observation", rows: observationRows)

                    if pin.category == .tissueTest {
                        AnalysisPlaceholderCard()
                    }
                }
                .padding(ScoutingTheme.spacingL)
                .padding(.bottom, ScoutingTheme.spacing2XL)
            }
            .background(ScoutingTheme.surfaceSecondary)
            .navigationTitle("Scouting report")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done", action: onDismiss)
                }
                ToolbarItem(placement: .primaryAction) {
                    ShareLink(item: shareText) {
                        Image(systemName: "square.and.arrow.up")
                    }
                }
            }
        }
    }

    private var shareText: String {
        "\(pin.label) — \(pin.treatmentZoneName)"
    }

    private var fieldGrowerCard: some View {
        VStack(alignment: .leading, spacing: ScoutingTheme.spacingS) {
            Text("Field context")
                .font(.caption.weight(.semibold))
                .foregroundStyle(ScoutingTheme.labelSecondary)
            Text("West 80 — Corn 2026")
                .font(.title3.weight(.bold))
            Text("Grower · Heartland Co-op")
                .font(.subheadline)
                .foregroundStyle(ScoutingTheme.labelSecondary)
            HStack(spacing: ScoutingTheme.spacingM) {
                Label("156 ac", systemImage: "square.dashed")
                Label("R2 target", systemImage: "leaf")
            }
            .font(.caption)
            .foregroundStyle(ScoutingTheme.labelSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(ScoutingTheme.spacingL)
        .background(ScoutingTheme.surface, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))
    }

    private var observationRows: [(String, String)] {
        var rows: [(String, String)] = [
            ("Issue", pin.category.rawValue),
            ("Treatment zone", pin.treatmentZoneName),
        ]
        if let gs = pin.growthStage {
            rows.append(("Growth stage", gs))
        }
        if let bc = pin.barcode {
            rows.append(("Barcode", bc))
        }
        if !pin.notes.isEmpty {
            rows.append(("Notes", pin.notes))
        }
        return rows
    }
}

// MARK: - Banner

private struct ReportStatusBanner: View {
    let lifecycle: PinLifecycle
    let category: IssueCategory

    var body: some View {
        HStack(alignment: .top, spacing: ScoutingTheme.spacingM) {
            Image(systemName: iconName)
                .font(.title3)
                .foregroundStyle(foreground)
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline.weight(.bold))
                Text(subtitle)
                    .font(.footnote)
                    .foregroundStyle(.primary.opacity(0.75))
            }
            Spacer(minLength: 0)
        }
        .padding(ScoutingTheme.spacingL)
        .background(background, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))
    }

    private var title: String {
        switch lifecycle {
        case .pendingReview: return "Pending review"
        case .saved: return "Approved on map"
        case .draft: return "Draft"
        }
    }

    private var subtitle: String {
        switch lifecycle {
        case .pendingReview:
            return "Your \(category.rawValue.lowercased()) pin is queued for agronomy review. You can keep scouting."
        case .saved:
            return "Visible to your team on the field map."
        case .draft:
            return "Not submitted."
        }
    }

    private var iconName: String {
        lifecycle == .pendingReview ? "clock.badge.exclamationmark" : "checkmark.seal.fill"
    }

    private var foreground: Color {
        lifecycle == .pendingReview ? ScoutingTheme.pending : ScoutingTheme.accent
    }

    private var background: Color {
        lifecycle == .pendingReview ? ScoutingTheme.pendingBackground : ScoutingTheme.accentMuted
    }
}

// MARK: - Trial card

public struct TrialMetadataCard: View {
    let trialId: String?
    let protocolName: String?
    let zoneName: String

    public init(trialId: String?, protocolName: String?, zoneName: String) {
        self.trialId = trialId
        self.protocolName = protocolName
        self.zoneName = zoneName
    }

    public var body: some View {
        if trialId == nil, protocolName == nil {
            EmptyView()
        } else {
            VStack(alignment: .leading, spacing: ScoutingTheme.spacingS) {
                Text("Trial metadata")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(ScoutingTheme.labelSecondary)
                if let trialId {
                    row(label: "Trial ID", value: trialId)
                }
                if let protocolName {
                    row(label: "Protocol", value: protocolName)
                }
                row(label: "Zone", value: zoneName)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(ScoutingTheme.spacingL)
            .background(ScoutingTheme.surface, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))
        }
    }

    private func row(label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label)
                .font(.caption2)
                .foregroundStyle(ScoutingTheme.labelSecondary)
            Text(value)
                .font(.body.weight(.medium))
        }
    }
}

// MARK: - Media carousel (placeholder tiles)

public struct MediaCarouselPlaceholder: View {
    let count: Int

    public init(count: Int) {
        self.count = count
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: ScoutingTheme.spacingS) {
            Text("Media")
                .font(.caption.weight(.semibold))
                .foregroundStyle(ScoutingTheme.labelSecondary)
            if count == 0 {
                Text("No photos attached")
                    .font(.footnote)
                    .foregroundStyle(ScoutingTheme.labelSecondary)
                    .padding(.vertical, ScoutingTheme.spacingS)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: ScoutingTheme.spacingM) {
                        ForEach(0 ..< count, id: \.self) { i in
                            RoundedRectangle(cornerRadius: 10, style: .continuous)
                                .fill(
                                    LinearGradient(
                                        colors: [ScoutingTheme.canopy.opacity(0.55), ScoutingTheme.sky.opacity(0.35)],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 120, height: 88)
                                .overlay {
                                    Image(systemName: "photo")
                                        .foregroundStyle(.white.opacity(0.9))
                                }
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Key-value

private func keyValueSection(title: String, rows: [(String, String)]) -> some View {
    VStack(alignment: .leading, spacing: ScoutingTheme.spacingM) {
        Text(title.uppercased())
            .font(.caption.weight(.semibold))
            .foregroundStyle(ScoutingTheme.labelSecondary)
        VStack(spacing: 0) {
            ForEach(rows.indices, id: \.self) { i in
                let row = rows[i]
                HStack(alignment: .top) {
                    Text(row.0)
                        .font(.subheadline)
                        .foregroundStyle(ScoutingTheme.labelSecondary)
                        .frame(width: 120, alignment: .leading)
                    Text(row.1)
                        .font(.subheadline.weight(.medium))
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding(.vertical, ScoutingTheme.spacingS)
                if i < rows.count - 1 {
                    Divider()
                }
            }
        }
        .padding(ScoutingTheme.spacingM)
        .background(ScoutingTheme.surface, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))
    }
}

// MARK: - Analysis

private struct AnalysisPlaceholderCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: ScoutingTheme.spacingS) {
            Text("Lab analysis")
                .font(.caption.weight(.semibold))
                .foregroundStyle(ScoutingTheme.labelSecondary)
            HStack(spacing: ScoutingTheme.spacingM) {
                ProgressView()
                VStack(alignment: .leading, spacing: 4) {
                    Text("Pending analysis")
                        .font(.body.weight(.semibold))
                    Text("Nutrient results will appear when the lab posts them.")
                        .font(.footnote)
                        .foregroundStyle(ScoutingTheme.labelSecondary)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(ScoutingTheme.spacingL)
        .background(ScoutingTheme.surface, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))
    }
}
