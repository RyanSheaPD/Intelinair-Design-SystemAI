import SwiftUI

public struct NewLocationComposerSheet: View {
    @Bindable public var model: ScoutingFlowViewModel
    @FocusState private var notesFocused: Bool

    public init(model: ScoutingFlowViewModel) {
        self.model = model
    }

    public var body: some View {
        NavigationStack {
            Group {
                switch model.sheetStep {
                case .category:
                    categoryStep
                case .tissueForm:
                    tissueStep
                case .genericForm:
                    genericStep
                }
            }
            .background(ScoutingTheme.surfaceSecondary)
            .navigationTitle(navigationTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") {
                        model.requestDismissComposer()
                    }
                }
                if model.sheetStep != .category {
                    ToolbarItem(placement: .topBarLeading) {
                        Button {
                            if model.sheetStep == .tissueForm || model.sheetStep == .genericForm {
                                model.sheetStep = .category
                            }
                        } label: {
                            Image(systemName: "chevron.backward")
                        }
                        .accessibilityLabel("Back to category")
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                bottomBar
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .presentationCornerRadius(ScoutingTheme.cornerRadiusSheet)
        .alert("Discard pin?", isPresented: $model.showDiscardConfirmation) {
            Button("Discard", role: .destructive) {
                model.dismissComposerDiscarding()
            }
            Button("Keep editing", role: .cancel) {
                model.dismissComposerKeepEditing()
            }
        } message: {
            Text("You have unsaved changes.")
        }
        .fullScreenCover(isPresented: $model.isBarcodeScannerPresented) {
            BarcodeScanView { code in
                model.simulateBarcodeScanned(code)
            }
        }
    }

    private var navigationTitle: String {
        switch model.sheetStep {
        case .category: return "New Location"
        case .tissueForm: return "Tissue test"
        case .genericForm: return model.selectedCategory?.rawValue ?? "Observation"
        }
    }

    // MARK: Category

    private var categoryStep: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: ScoutingTheme.spacingL) {
                Text("What are you recording?")
                    .font(.subheadline)
                    .foregroundStyle(ScoutingTheme.labelSecondary)

                LazyVGrid(
                    columns: [GridItem(.flexible(), spacing: ScoutingTheme.spacingM), GridItem(.flexible(), spacing: ScoutingTheme.spacingM)],
                    spacing: ScoutingTheme.spacingM
                ) {
                    ForEach(IssueCategory.allCases) { cat in
                        IssueCategoryCell(
                            category: cat,
                            isSelected: model.selectedCategory == cat
                        ) {
                            model.selectedCategory = cat
                        }
                    }
                }

                if model.saveErrorMessage != nil {
                    Text(model.saveErrorMessage!)
                        .font(.footnote)
                        .foregroundStyle(.red)
                }
            }
            .padding(ScoutingTheme.spacingL)
        }
    }

    // MARK: Tissue

    private var tissueStep: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: ScoutingTheme.spacingL) {
                CategorySummaryRow(category: .tissueTest) {
                    model.changeCategoryFromForm()
                }

                FormSectionHeader(title: "Required", required: true)

                Picker("Zone", selection: Binding(
                    get: { model.treatmentZoneId ?? "" },
                    set: { model.treatmentZoneId = $0.isEmpty ? nil : $0 }
                )) {
                    Text("Select zone").tag("")
                    ForEach(model.treatmentZones) { z in
                        Text(z.name).tag(z.id)
                    }
                }
                .pickerStyle(.menu)
                .padding(ScoutingTheme.spacingM)
                .background(ScoutingTheme.surface, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))

                Button {
                    model.isBarcodeScannerPresented = true
                } label: {
                    Label("Scan barcode", systemImage: "barcode.viewfinder")
                        .font(.body.weight(.semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                }
                .buttonStyle(.bordered)
                .tint(ScoutingTheme.accent)

                VStack(alignment: .leading, spacing: ScoutingTheme.spacingXS) {
                    Text("Barcode number")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(ScoutingTheme.labelSecondary)
                    TextField("Optional — scan or type", text: $model.barcode)
                        .font(.body.monospaced())
                        .textFieldStyle(.roundedBorder)
                        .onChange(of: model.barcode) { _, new in
                            if !new.isEmpty, model.barcodeSource == .none {
                                model.barcodeSource = .manual
                            }
                        }
                    if model.barcodeSource == .scan {
                        Text("From scan")
                            .font(.caption2)
                            .foregroundStyle(ScoutingTheme.accent)
                    }
                }

                FormSectionHeader(title: "Attachments", required: false)
                MediaStripRow(count: model.mediaCount, onAdd: { model.addMedia() }, onRemove: { model.removeMediaSlot() })

                FormSectionHeader(title: "Notes", required: false)
                TextField("Add context for the lab or team", text: $model.notes, axis: .vertical)
                    .lineLimit(3 ... 6)
                    .padding(ScoutingTheme.spacingM)
                    .background(ScoutingTheme.surface, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))
                    .focused($notesFocused)

                FormSectionHeader(title: "Growth stage", required: false)
                Picker("Growth stage", selection: Binding(
                    get: { model.growthStage ?? "" },
                    set: { model.growthStage = $0.isEmpty ? nil : $0 }
                )) {
                    Text("Not specified").tag("")
                    ForEach(ScoutingFlowViewModel.growthStages, id: \.self) { g in
                        Text(g).tag(g)
                    }
                }
                .pickerStyle(.menu)
                .padding(ScoutingTheme.spacingM)
                .background(ScoutingTheme.surface, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))

                Button(role: .destructive) {
                    model.deleteDraftPin()
                } label: {
                    Label("Delete pin", systemImage: "trash")
                        .frame(maxWidth: .infinity)
                }
                .padding(.top, ScoutingTheme.spacingM)
            }
            .padding(ScoutingTheme.spacingL)
            .padding(.bottom, 88)
        }
    }

    // MARK: Generic (non-tissue)

    private var genericStep: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: ScoutingTheme.spacingL) {
                if let cat = model.selectedCategory {
                    CategorySummaryRow(category: cat) {
                        model.changeCategoryFromForm()
                    }
                }
                FormSectionHeader(title: "Notes", required: false)
                TextField("What did you see?", text: $model.notes, axis: .vertical)
                    .lineLimit(3 ... 6)
                    .padding(ScoutingTheme.spacingM)
                    .background(ScoutingTheme.surface, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))

                Button(role: .destructive) {
                    model.deleteDraftPin()
                } label: {
                    Label("Delete pin", systemImage: "trash")
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(ScoutingTheme.spacingL)
            .padding(.bottom, 88)
        }
    }

    // MARK: Bottom bar

    @ViewBuilder
    private var bottomBar: some View {
        VStack(spacing: ScoutingTheme.spacingS) {
            if model.sheetStep == .category {
                Text(model.selectedCategory == nil ? "Select a category to continue" : " ")
                    .font(.caption)
                    .foregroundStyle(ScoutingTheme.labelSecondary)
                    .frame(maxWidth: .infinity, alignment: .leading)

                Button {
                    model.continueFromCategory()
                } label: {
                    if model.selectedCategory == .tissueTest {
                        Text("Continue to tissue test")
                    } else {
                        Text("Continue")
                    }
                }
                .buttonStyle(ProminentBottomButtonStyle())
                .disabled(!model.canContinueFromCategory)
            } else {
                if model.sheetStep == .tissueForm {
                    Text(model.canSaveTissueForm ? " " : "Select a treatment zone to save")
                        .font(.caption)
                        .foregroundStyle(ScoutingTheme.labelSecondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                Button {
                    Task { await model.saveAnnotation() }
                } label: {
                    if model.isSaving {
                        ProgressView()
                            .tint(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                    } else {
                        Text("Save pin")
                            .font(.body.weight(.semibold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                    }
                }
                .buttonStyle(ProminentBottomButtonStyle())
                .disabled(!model.canSaveCurrentStep || model.isSaving)
            }
        }
        .padding(.horizontal, ScoutingTheme.spacingL)
        .padding(.top, ScoutingTheme.spacingM)
        .padding(.bottom, ScoutingTheme.spacingL)
        .background(.bar)
    }
}

// MARK: - Building blocks

private struct FormSectionHeader: View {
    let title: String
    let required: Bool

    var body: some View {
        HStack(spacing: ScoutingTheme.spacingXS) {
            Text(title.uppercased())
                .font(.caption.weight(.semibold))
                .foregroundStyle(ScoutingTheme.labelSecondary)
            if required {
                Text("Required")
                    .font(.caption2.weight(.bold))
                    .foregroundStyle(ScoutingTheme.pending)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(ScoutingTheme.pendingBackground, in: Capsule())
            }
        }
    }
}

private struct IssueCategoryCell: View {
    let category: IssueCategory
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: ScoutingTheme.spacingS) {
                Image(systemName: category.systemImage)
                    .font(.title2)
                    .foregroundStyle(isSelected ? ScoutingTheme.accent : ScoutingTheme.labelSecondary)
                Text(category.rawValue)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(ScoutingTheme.labelPrimary)
                    .multilineTextAlignment(.leading)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(ScoutingTheme.spacingM)
            .background(
                RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous)
                    .fill(isSelected ? ScoutingTheme.accentMuted : ScoutingTheme.surface)
            )
            .overlay(
                RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous)
                    .strokeBorder(isSelected ? ScoutingTheme.accent : ScoutingTheme.separator.opacity(0.5), lineWidth: isSelected ? 2 : 0.5)
            )
        }
        .buttonStyle(.plain)
    }
}

private struct CategorySummaryRow: View {
    let category: IssueCategory
    let onChange: () -> Void

    var body: some View {
        HStack {
            Image(systemName: category.systemImage)
                .foregroundStyle(ScoutingTheme.accent)
            VStack(alignment: .leading, spacing: 2) {
                Text("Issue category")
                    .font(.caption)
                    .foregroundStyle(ScoutingTheme.labelSecondary)
                Text(category.rawValue)
                    .font(.body.weight(.semibold))
            }
            Spacer()
            Button("Change", action: onChange)
                .font(.subheadline.weight(.semibold))
        }
        .padding(ScoutingTheme.spacingM)
        .background(ScoutingTheme.surface, in: RoundedRectangle(cornerRadius: ScoutingTheme.cornerRadiusCard, style: .continuous))
    }
}

private struct MediaStripRow: View {
    let count: Int
    let onAdd: () -> Void
    let onRemove: () -> Void

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: ScoutingTheme.spacingM) {
                Button(action: onAdd) {
                    VStack(spacing: 6) {
                        Image(systemName: "plus")
                            .font(.title3.weight(.semibold))
                        Text("Add")
                            .font(.caption2.weight(.medium))
                    }
                    .frame(width: 72, height: 72)
                    .background(ScoutingTheme.accentMuted, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 10, style: .continuous)
                            .strokeBorder(ScoutingTheme.accent.opacity(0.35), style: StrokeStyle(lineWidth: 1, dash: [4, 4]))
                    )
                }
                .buttonStyle(.plain)
                .foregroundStyle(ScoutingTheme.accent)

                ForEach(0 ..< count, id: \.self) { i in
                    ZStack(alignment: .topTrailing) {
                        RoundedRectangle(cornerRadius: 10, style: .continuous)
                            .fill(
                                LinearGradient(colors: [ScoutingTheme.canopy.opacity(0.5), ScoutingTheme.fieldGreen.opacity(0.45)], startPoint: .top, endPoint: .bottom)
                            )
                            .frame(width: 72, height: 72)
                            .overlay {
                                Image(systemName: "leaf.fill")
                                    .foregroundStyle(.white.opacity(0.9))
                            }
                        Button {
                            onRemove()
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .symbolRenderingMode(.palette)
                                .foregroundStyle(.white, .black.opacity(0.45))
                        }
                        .offset(x: 6, y: -6)
                    }
                }
            }
        }
    }
}

private struct ProminentBottomButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(ScoutingTheme.accent.opacity(configuration.isPressed ? 0.85 : 1))
            )
            .foregroundStyle(.white)
            .opacity(configuration.isPressed ? 0.95 : 1)
    }
}
