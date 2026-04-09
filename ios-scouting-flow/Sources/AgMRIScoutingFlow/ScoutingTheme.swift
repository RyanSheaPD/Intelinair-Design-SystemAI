import SwiftUI

/// Production-lean agronomy palette (aligned with Intelinair-style greens + neutral UI).
public enum ScoutingTheme {
    public static let fieldGreen = Color(red: 0.18, green: 0.42, blue: 0.28)
    public static let canopy = Color(red: 0.12, green: 0.35, blue: 0.22)
    public static let soil = Color(red: 0.35, green: 0.30, blue: 0.24)
    public static let sky = Color(red: 0.45, green: 0.62, blue: 0.78)

    public static let labelPrimary = Color.primary
    public static let labelSecondary = Color.secondary
    public static let surface = Color(uiColor: .systemBackground)
    public static let surfaceSecondary = Color(uiColor: .secondarySystemGroupedBackground)
    public static let separator = Color(uiColor: .separator)

    public static let accent = Color(red: 0.15, green: 0.52, blue: 0.35)
    public static let accentMuted = Color(red: 0.15, green: 0.52, blue: 0.35).opacity(0.14)
    public static let pending = Color(red: 0.85, green: 0.55, blue: 0.12)
    public static let pendingBackground = Color(red: 0.85, green: 0.55, blue: 0.12).opacity(0.15)

    public static let fabShadow = Color.black.opacity(0.22)

    public static let cornerRadiusSheet: CGFloat = 16
    public static let cornerRadiusCard: CGFloat = 12
    public static let spacingXS: CGFloat = 4
    public static let spacingS: CGFloat = 8
    public static let spacingM: CGFloat = 12
    public static let spacingL: CGFloat = 16
    public static let spacingXL: CGFloat = 20
    public static let spacing2XL: CGFloat = 24
}
