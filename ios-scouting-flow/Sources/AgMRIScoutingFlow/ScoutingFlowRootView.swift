import SwiftUI

/// Single entry: map, composer sheet, barcode cover, report sheet.
public struct ScoutingFlowRootView: View {
    @State private var model = ScoutingFlowViewModel()

    public init() {}

    public var body: some View {
        MapFieldScreen(model: model)
            .sheet(isPresented: $model.isNewLocationSheetPresented) {
                NewLocationComposerSheet(model: model)
            }
            .sheet(isPresented: $model.isReportPresented) {
                if let pin = model.reportPin {
                    ScoutingReportDetailView(pin: pin) {
                        model.dismissReport()
                    }
                }
            }
    }
}

#if DEBUG
#Preview("Scouting flow") {
    ScoutingFlowRootView()
}
#endif
