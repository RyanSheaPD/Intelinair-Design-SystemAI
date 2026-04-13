// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AgMRIScoutingFlow",
    platforms: [
        .iOS(.v17),
    ],
    products: [
        .library(
            name: "AgMRIScoutingFlow",
            targets: ["AgMRIScoutingFlow"]
        ),
    ],
    targets: [
        .target(
            name: "AgMRIScoutingFlow",
            path: "Sources/AgMRIScoutingFlow"
        ),
    ]
)
