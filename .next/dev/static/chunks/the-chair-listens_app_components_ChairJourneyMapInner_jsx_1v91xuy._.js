(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChairJourneyMapInner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
// Destination: components/ChairJourneyMapInner.jsx
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react-leaflet/lib/MapContainer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react-leaflet/lib/TileLayer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react-leaflet/lib/Marker.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react-leaflet/lib/Popup.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react-leaflet/lib/CircleMarker.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/leaflet/dist/leaflet-src.js [client] (ecmascript)");
;
;
;
;
// Leaflet's default marker icons break under bundlers unless re-pointed manually
delete __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.prototype._getIconUrl;
__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});
const SOUTH_AFRICA_CENTER = [
    -28.4793,
    24.6727
];
// Builds a numbered badge pin for a visitor group, sized slightly by count
// so "3 people connected" reads at a glance without opening the popup.
function visitorIcon(count) {
    const size = Math.min(24 + count * 2, 44);
    return __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].divIcon({
        className: "visitor-pin",
        html: `<div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: #2A4FA0;
            border: 2px solid #AEB8D6;
            color: #F5F6FA;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: sans-serif;
            font-weight: 700;
            font-size: ${size > 32 ? 15 : 13}px;
        ">${count}</div>`,
        iconSize: [
            size,
            size
        ],
        iconAnchor: [
            size / 2,
            size / 2
        ]
    });
}
function ChairJourneyMapInner({ locations = [], visitors = [] }) {
    const center = locations.length ? [
        locations[locations.length - 1].lat,
        locations[locations.length - 1].lng
    ] : SOUTH_AFRICA_CENTER;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["MapContainer"], {
        center: center,
        zoom: locations.length ? 6 : 5,
        style: {
            width: "100%",
            height: "440px"
        },
        scrollWheelZoom: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }, void 0, false, {
                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                lineNumber: 53,
                columnNumber: 13
            }, this),
            locations.map((loc)=>loc.active ? // Active stop: pulsing gold marker, styled to match the campaign theme
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$client$5d$__$28$ecmascript$29$__["CircleMarker"], {
                    center: [
                        loc.lat,
                        loc.lng
                    ],
                    radius: 10,
                    pathOptions: {
                        color: "#B99B5B",
                        fillColor: "#D9C489",
                        fillOpacity: 0.9,
                        weight: 2
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Popup"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: loc.name
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                                lineNumber: 73,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                                lineNumber: 74,
                                columnNumber: 29
                            }, this),
                            "Currently active"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                        lineNumber: 72,
                        columnNumber: 25
                    }, this)
                }, loc.id, false, {
                    fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                    lineNumber: 61,
                    columnNumber: 21
                }, this) : // Past stop: standard marker
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Marker"], {
                    position: [
                        loc.lat,
                        loc.lng
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Popup"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: loc.name
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                                lineNumber: 82,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                                lineNumber: 83,
                                columnNumber: 29
                            }, this),
                            loc.response_count ?? 0,
                            " responses collected"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                        lineNumber: 81,
                        columnNumber: 25
                    }, this)
                }, loc.id, false, {
                    fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                    lineNumber: 80,
                    columnNumber: 21
                }, this)),
            visitors.filter((v)=>v.lat != null && v.lng != null).map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Marker"], {
                    position: [
                        v.lat,
                        v.lng
                    ],
                    icon: visitorIcon(v.visitor_count),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Popup"], {
                        children: [
                            v.visitor_count,
                            " ",
                            v.visitor_count === 1 ? "person" : "people",
                            " opened The Chair Listens near ",
                            v.location,
                            " in the last 24 hours."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                        lineNumber: 98,
                        columnNumber: 25
                    }, this)
                }, `visitor-${v.location}`, false, {
                    fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
                    lineNumber: 93,
                    columnNumber: 21
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx",
        lineNumber: 47,
        columnNumber: 9
    }, this);
}
_c = ChairJourneyMapInner;
var _c;
__turbopack_context__.k.register(_c, "ChairJourneyMapInner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx [client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=the-chair-listens_app_components_ChairJourneyMapInner_jsx_1v91xuy._.js.map