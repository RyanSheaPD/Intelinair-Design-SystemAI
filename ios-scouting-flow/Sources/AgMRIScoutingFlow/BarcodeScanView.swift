import SwiftUI

/// Camera-style full-screen flow; production would wrap `AVCaptureSession`.
public struct BarcodeScanView: View {
    @Environment(\.dismiss) private var dismiss
    let onUseCode: (String) -> Void

    @State private var simulatedCode = "AGMRI-2026-004812"

    public init(onUseCode: @escaping (String) -> Void) {
        self.onUseCode = onUseCode
    }

    public var body: some View {
        NavigationStack {
            ZStack {
                LinearGradient(
                    colors: [
                        Color.black.opacity(0.92),
                        ScoutingTheme.canopy.opacity(0.55),
                        Color.black.opacity(0.88),
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                VStack(spacing: ScoutingTheme.spacingXL) {
                    Spacer(minLength: 24)
                    Text("Align barcode in frame")
                        .font(.headline)
                        .foregroundStyle(.white)

                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .strokeBorder(Color.white.opacity(0.85), lineWidth: 2)
                        .frame(height: 120)
                        .padding(.horizontal, 40)
                        .background(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(Color.white.opacity(0.06))
                        )

                    Text("Demo: use sample barcode or edit below")
                        .font(.footnote)
                        .foregroundStyle(.white.opacity(0.75))

                    TextField("Barcode", text: $simulatedCode)
                        .textFieldStyle(.roundedBorder)
                        .font(.body.monospaced())
                        .padding(.horizontal, ScoutingTheme.spacingL)
                        .colorScheme(.dark)

                    Spacer()

                    VStack(spacing: ScoutingTheme.spacingM) {
                        Button {
                            onUseCode(simulatedCode.trimmingCharacters(in: .whitespacesAndNewlines))
                        } label: {
                            Text("Use barcode")
                                .font(.body.weight(.semibold))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(ScoutingTheme.accent)

                        Button("Enter manually on form") {
                            dismiss()
                        }
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.white.opacity(0.9))

                        Button("Cancel", role: .cancel) {
                            dismiss()
                        }
                        .font(.body)
                        .foregroundStyle(.white.opacity(0.75))
                    }
                    .padding(.horizontal, ScoutingTheme.spacingL)
                    .padding(.bottom, ScoutingTheme.spacing2XL)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                        .foregroundStyle(.white)
                }
                ToolbarItem(placement: .principal) {
                    Text("Scan barcode")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.white)
                }
            }
            .toolbarBackground(.hidden, for: .navigationBar)
        }
    }
}
