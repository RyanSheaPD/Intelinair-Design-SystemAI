import MapKit
import SwiftUI

/// Map-first field view: boundary feel via standard map, pins, FAB, placement mode, composer entry.
public struct MapFieldScreen: View {
    @Bindable public var model: ScoutingFlowViewModel
    @State private var cameraPosition: MapCameraPosition

    public init(model: ScoutingFlowViewModel) {
        self.model = model
        _cameraPosition = State(initialValue: .region(model.region))
    }

    public var body: some View {
        ZStack(alignment: .bottomTrailing) {
            VStack {
                HStack(spacing: ScoutingTheme.spacingS) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("West 80")
                            .font(.subheadline.weight(.semibold))
                        Text("Corn · 2026 season")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Spacer()
                    Image(systemName: "cloud.sun.fill")
                        .font(.title3)
                        .symbolRenderingMode(.hierarchical)
                        .foregroundStyle(ScoutingTheme.sky)
                }
                .padding(.horizontal, ScoutingTheme.spacingL)
                .padding(.vertical, ScoutingTheme.spacingM)
                .background(.ultraThinMaterial)
                Spacer()
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            .allowsHitTesting(false)

            MapReader { proxy in
                Map(position: $cameraPosition, interactionModes: .all) {
                    ForEach(model.pins) { pin in
                        Annotation(pin.label, coordinate: pin.coordinate) {
                            MapPinGlyph(lifecycle: pin.lifecycle, label: pin.label)
                                .onTapGesture {
                                    model.openReport(for: pin)
                                }
                        }
                    }
                }
                .mapStyle(.standard(elevation: .automatic))
                .simultaneousGesture(
                    DragGesture(minimumDistance: 0)
                        .onEnded { value in
                            guard model.isPinPlacementArmed else { return }
                            let pt = value.startLocation
                            if let coord = proxy.convert(pt, from: .local) {
                                model.mapTapped(at: coord)
                            }
                        }
                )
            }
            .ignoresSafeArea(edges: .top)

            if model.isPinPlacementArmed {
                PinPlacementChrome(onCancel: { model.cancelPinPlacement() })
            }

            VStack {
                Spacer()
                HStack {
                    Spacer()
                    FloatingScoutingFAB(action: { model.openToolMenu() })
                        .padding(.trailing, ScoutingTheme.spacingL)
                        .padding(.bottom, ScoutingTheme.spacingXL)
                }
            }
        }
        .confirmationDialog("Scouting tools", isPresented: $model.isToolMenuPresented, titleVisibility: .visible) {
            Button("Pin") { model.selectPinTool() }
            Button("Polygon") {}
            Button("Free Draw") {}
            Button("Grid") {}
            Button("Measure") {}
            Button("Cancel", role: .cancel) {}
        }
    }
}

// MARK: - Chrome

private struct PinPlacementChrome: View {
    let onCancel: () -> Void

    var body: some View {
        ZStack {
            // Dimming must not intercept map taps — only visual.
            Color.black.opacity(0.12)
                .allowsHitTesting(false)

            VStack(spacing: 0) {
                HStack {
                    Button("Cancel", action: onCancel)
                        .font(.body.weight(.medium))
                        .foregroundStyle(ScoutingTheme.accent)
                    Spacer()
                }
                .padding(.horizontal, ScoutingTheme.spacingL)
                .padding(.vertical, ScoutingTheme.spacingM)
                .background(.ultraThinMaterial)

                Spacer(minLength: 0)

                VStack(spacing: ScoutingTheme.spacingS) {
                    Image(systemName: "mappin.circle.fill")
                        .font(.system(size: 44))
                        .symbolRenderingMode(.hierarchical)
                        .foregroundStyle(ScoutingTheme.accent)
                    Text("Tap where you sampled")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.primary)
                        .shadow(color: .white.opacity(0.6), radius: 0, y: 0.5)
                    Text("Pan and zoom first, then tap the map to drop the pin.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, ScoutingTheme.spacing2XL)
                }
                .padding(.bottom, 120)
                .allowsHitTesting(false)

                Spacer(minLength: 0)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

public struct FloatingScoutingFAB: View {
    let action: () -> Void

    public init(action: @escaping () -> Void) {
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            Image(systemName: "scope")
                .font(.system(size: 22, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 56, height: 56)
                .background(
                    Circle()
                        .fill(ScoutingTheme.accent)
                        .shadow(color: ScoutingTheme.fabShadow, radius: 8, y: 4)
                )
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Scouting tools")
    }
}

public struct MapPinGlyph: View {
    let lifecycle: PinLifecycle
    let label: String

    public init(lifecycle: PinLifecycle, label: String) {
        self.lifecycle = lifecycle
        self.label = label
    }

    public var body: some View {
        VStack(spacing: 4) {
            ZStack {
                Circle()
                    .fill(lifecycle == .pendingReview ? ScoutingTheme.pending : ScoutingTheme.accent)
                    .frame(width: 20, height: 20)
                    .overlay(Circle().strokeBorder(Color.white, lineWidth: 2))
                    .shadow(color: .black.opacity(0.2), radius: 2, y: 1)
                Image(systemName: "leaf.fill")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundStyle(.white)
            }
            Text(label)
                .font(.caption2.weight(.semibold))
                .foregroundStyle(.primary)
                .padding(.horizontal, 6)
                .padding(.vertical, 3)
                .background(.ultraThinMaterial, in: Capsule())
                .overlay(
                    Capsule()
                        .strokeBorder(ScoutingTheme.separator.opacity(0.6), lineWidth: 0.5)
                )
        }
    }
}
