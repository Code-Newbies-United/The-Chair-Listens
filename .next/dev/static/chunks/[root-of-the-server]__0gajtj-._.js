(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/the-chair-listens/app/pages/index\" }", (function(__turbopack_context__){
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/the-chair-listens/app/pages/index.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/the-chair-listens/app/pages/index.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/the-chair-listens/app/pages/index.jsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if ("TURBOPACK compile-time truthy", 1) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AboutFactorOfTen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/styled-jsx/style.js [client] (ecmascript)");
// Destination: components/AboutFactorOfTen.jsx
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const FOUNDERS = [
    {
        name: "Jonathan Muthige",
        role: "Chairperson & Co-Founder",
        initials: "JM",
        // Put the photo files in /public/founders/
        photo: "/founders/jonathan-muthige.jpg"
    },
    {
        name: "Nwabisa Muthige",
        role: "CEO & Co-Founder",
        initials: "NM",
        photo: "/founders/nwabisa-muthige.jpg"
    }
];
function FounderPhoto({ founder }) {
    _s();
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
        className: "about-founder",
        children: [
            failed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "about-founder-fallback",
                "aria-hidden": "true",
                children: founder.initials
            }, void 0, false, {
                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                lineNumber: 26,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                className: "about-founder-photo",
                src: founder.photo,
                alt: `Portrait of ${founder.name}`,
                onError: ()=>setFailed(true)
            }, void 0, false, {
                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                lineNumber: 30,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: founder.name
                    }, void 0, false, {
                        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                        lineNumber: 38,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: founder.role
                    }, void 0, false, {
                        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                        lineNumber: 39,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                lineNumber: 37,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
        lineNumber: 24,
        columnNumber: 9
    }, this);
}
_s(FounderPhoto, "BFa/7w0IiJnSoWJxZHxuU4kOwF4=");
_c = FounderPhoto;
function AboutFactorOfTen({ open, onClose }) {
    _s1();
    const closeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AboutFactorOfTen.useEffect": ()=>{
            if (!open) return;
            const previouslyFocused = document.activeElement;
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            closeRef.current?.focus();
            function onKeyDown(e) {
                if (e.key === "Escape") onClose();
            }
            window.addEventListener("keydown", onKeyDown);
            return ({
                "AboutFactorOfTen.useEffect": ()=>{
                    window.removeEventListener("keydown", onKeyDown);
                    document.body.style.overflow = previousOverflow;
                    previouslyFocused?.focus?.();
                }
            })["AboutFactorOfTen.useEffect"];
        }
    }["AboutFactorOfTen.useEffect"], [
        open,
        onClose
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onClose,
        role: "presentation",
        className: "jsx-79b8bccc695b754d" + " " + "about-overlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "79b8bccc695b754d",
                children: ".about-overlay{z-index:100;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);background:#112d25b8;justify-content:center;align-items:flex-end;padding:0;animation:.2s both about-fade;display:flex;position:fixed;inset:0}.about-dialog{-webkit-overflow-scrolling:touch;background:var(--cream);width:100%;max-width:760px;max-height:92dvh;color:var(--forest);padding:34px 22px max(28px, env(safe-area-inset-bottom));border-radius:24px 24px 0 0;animation:.26s both about-rise;position:relative;overflow-y:auto}.about-close{float:right;z-index:2;background:var(--forest);width:38px;height:38px;color:var(--white);cursor:pointer;border:0;border-radius:50%;margin:-12px -6px 0 12px;font-size:20px;line-height:1;position:sticky;top:0}.about-close:hover{background:var(--forest-deep)}.about-close:focus-visible,.about-cta:focus-visible{outline:3px solid var(--ochre);outline-offset:3px}.about-title{letter-spacing:-.045em;color:var(--forest);margin:0 0 6px;font-size:max(30px,min(7vw,44px));font-weight:900;line-height:1}.about-script{color:var(--ochre);margin:0 0 22px;font-family:Pinyon Script,cursive;font-size:32px;line-height:1}.about-founders{grid-template-columns:1fr 1fr;gap:14px;margin:0 0 26px;display:grid}.about-founder{text-align:center;margin:0}.about-founder-photo,.about-founder-fallback{aspect-ratio:4/5;object-fit:cover;background:var(--powder-blue);border-radius:18px;width:100%;display:block}.about-founder-fallback{background:var(--mint);color:var(--forest);letter-spacing:-.04em;justify-content:center;align-items:center;font-size:44px;font-weight:900;display:flex}.about-founder figcaption{flex-direction:column;gap:2px;margin-top:10px;font-size:13px;line-height:1.35;display:flex}.about-founder figcaption span{color:var(--sage);font-size:12px}.about-body{max-width:62ch}.about-body h3{letter-spacing:-.02em;margin:22px 0 6px;font-size:17px}.about-body p{color:#3f524c;margin:0 0 12px;font-size:14px;line-height:1.65}.about-quote{border-left:4px solid var(--ochre);background:var(--powder-blue);color:var(--forest);border-radius:0 14px 14px 0;margin:22px 0 0;padding:16px 18px;font-size:14px;font-weight:600;line-height:1.55}.about-cta{background:var(--forest);width:100%;color:var(--white);cursor:pointer;border:0;border-radius:100px;margin-top:24px;padding:14px 20px;font-size:14px;font-weight:800;display:block}.about-cta:hover{background:var(--forest-deep)}@keyframes about-fade{0%{opacity:0}to{opacity:1}}@keyframes about-rise{0%{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}@media (width>=700px){.about-overlay{align-items:center;padding:24px}.about-dialog{border-radius:26px;padding:44px 48px 36px}.about-founders{gap:22px}.about-body p{font-size:15px}}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "dialog",
                "aria-modal": "true",
                "aria-labelledby": "about-title",
                onClick: (e)=>e.stopPropagation(),
                className: "jsx-79b8bccc695b754d" + " " + "about-dialog",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        ref: closeRef,
                        type: "button",
                        onClick: onClose,
                        "aria-label": "Close about Factor of Ten",
                        className: "jsx-79b8bccc695b754d" + " " + "about-close",
                        children: "×"
                    }, void 0, false, {
                        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                        lineNumber: 280,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: "about-title",
                        className: "jsx-79b8bccc695b754d" + " " + "about-title",
                        children: "Born from faith, courage and resilience."
                    }, void 0, false, {
                        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                        lineNumber: 290,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-79b8bccc695b754d" + " " + "about-script",
                        children: "The story of Factor of Ten"
                    }, void 0, false, {
                        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                        lineNumber: 293,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-79b8bccc695b754d" + " " + "about-founders",
                        children: FOUNDERS.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FounderPhoto, {
                                founder: f
                            }, f.name, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 297,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                        lineNumber: 295,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-79b8bccc695b754d" + " " + "about-body",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "jsx-79b8bccc695b754d",
                                children: "A diagnosis that became a calling"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 302,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-79b8bccc695b754d",
                                children: "In 2023, Jonathan Muthige was diagnosed with Stage 3 aggressive prostate cancer. It began with unexplained shoulder pain on a family holiday, and a PSA test then revealed critically elevated levels."
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 303,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-79b8bccc695b754d",
                                children: "What struck him most was how unprepared and uninformed his family felt. Together with his wife, Nwabisa, and their children, they worked through fear, medical decisions and emotional strain. After robotic surgery and months of recovery, survival became purpose."
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 308,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-79b8bccc695b754d",
                                children: "They saw how many families face the same battle without information, early detection, mental health support or strong care networks. The Factor of Ten Foundation was born from that experience."
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 314,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "jsx-79b8bccc695b754d",
                                children: "More than just a name"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 320,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-79b8bccc695b754d",
                                children: "Factor of Ten is a belief in exponential impact: small, intentional acts, multiplied by courage and collective responsibility, can change systems, communities and futures."
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 321,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "jsx-79b8bccc695b754d",
                                children: "Where the Foundation works"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 327,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-79b8bccc695b754d",
                                children: "Prostate cancer awareness, mental health and resilience, engaging individuals and organisations to give a fraction of their time and skills, and community empowerment and advocacy."
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 328,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-79b8bccc695b754d" + " " + "about-quote",
                                children: "Small Acts. Tenfold Impact. When education is practical, advocacy is relentless and support is inclusive, impact multiplies."
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                                lineNumber: 334,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                        lineNumber: 301,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onClose,
                        className: "jsx-79b8bccc695b754d" + " " + "about-cta",
                        children: "Back to The Chair"
                    }, void 0, false, {
                        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                        lineNumber: 340,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
                lineNumber: 273,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx",
        lineNumber: 71,
        columnNumber: 9
    }, this);
}
_s1(AboutFactorOfTen, "GT2K607LEp8jm6Vo4w60mdjRd68=");
_c1 = AboutFactorOfTen;
var _c, _c1;
__turbopack_context__.k.register(_c, "FounderPhoto");
__turbopack_context__.k.register(_c1, "AboutFactorOfTen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/the-chair-listens/app/components/AdminGestureLogo.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TAPS_REQUIRED",
    ()=>TAPS_REQUIRED,
    "TAP_WINDOW_MS",
    ()=>TAP_WINDOW_MS,
    "default",
    ()=>AdminGestureLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
//AdminGestureLogo
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const TAPS_REQUIRED = 5;
const TAP_WINDOW_MS = 3000;
function AdminGestureLogo({ style, ...imgProps }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const taps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    function handleClick() {
        const now = Date.now();
        taps.current = [
            ...taps.current.filter((t)=>now - t < TAP_WINDOW_MS),
            now
        ];
        if (taps.current.length >= TAPS_REQUIRED) {
            taps.current = [];
            router.push("/admin/login");
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        ...imgProps,
        alt: imgProps.alt || "",
        onClick: handleClick,
        draggable: false,
        style: {
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            ...style
        }
    }, void 0, false, {
        fileName: "[project]/the-chair-listens/app/components/AdminGestureLogo.jsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_s(AdminGestureLogo, "wVAQSq5ky2PZJhJ00NIvwu/7Y4Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminGestureLogo;
var _c;
__turbopack_context__.k.register(_c, "AdminGestureLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/the-chair-listens/app/components/ChairJourneyMap.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChairJourneyMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
// Destination: components/ChairJourneyMap.jsx
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/next/dynamic.js [client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
;
;
// Leaflet touches `window`, so the actual map only ever renders client-side
const Map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx [client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/the-chair-listens/app/components/ChairJourneyMapInner.jsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: styles.mapLoading,
            children: "Loading map..."
        }, void 0, false, {
            fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
            lineNumber: 8,
            columnNumber: 20
        }, ("TURBOPACK compile-time value", void 0))
});
_c = Map;
function ChairJourneyMap() {
    _s();
    const [locations, setLocations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [visitors, setVisitors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChairJourneyMap.useEffect": ()=>{
            let cancelled = false;
            async function loadLocations() {
                try {
                    const res = await fetch("/api/locations", {
                        cache: "no-store"
                    });
                    if (!res.ok) {
                        throw new Error(`Locations request failed: ${res.status}`);
                    }
                    const data = await res.json();
                    if (!cancelled) {
                        setLocations(Array.isArray(data.locations) ? data.locations : []);
                    }
                } catch (err) {
                    console.error("Failed to load chair locations:", err);
                    if (!cancelled) {
                        setError(true);
                    }
                } finally{
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            }
            loadLocations();
            return ({
                "ChairJourneyMap.useEffect": ()=>{
                    cancelled = true;
                }
            })["ChairJourneyMap.useEffect"];
        }
    }["ChairJourneyMap.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChairJourneyMap.useEffect": ()=>{
            fetch("/api/visitor-pins").then({
                "ChairJourneyMap.useEffect": (res)=>res.json()
            }["ChairJourneyMap.useEffect"]).then({
                "ChairJourneyMap.useEffect": (data)=>setVisitors(data.visitors || [])
            }["ChairJourneyMap.useEffect"]).catch({
                "ChairJourneyMap.useEffect": (err)=>{
                    console.error("Failed to load recent visitors:", err);
                }
            }["ChairJourneyMap.useEffect"]);
        }
    }["ChairJourneyMap.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChairJourneyMap.useEffect": ()=>{
            fetch("/api/visitor-pins").then({
                "ChairJourneyMap.useEffect": (res)=>res.json()
            }["ChairJourneyMap.useEffect"]).then({
                "ChairJourneyMap.useEffect": (data)=>setVisitors(data.visitors || [])
            }["ChairJourneyMap.useEffect"]).catch({
                "ChairJourneyMap.useEffect": (err)=>{
                    console.error("Failed to load recent visitors:", err);
                }
            }["ChairJourneyMap.useEffect"]);
        }
    }["ChairJourneyMap.useEffect"], []);
    const activeLocation = locations.find((loc)=>loc.active);
    const pastCount = locations.filter((loc)=>!loc.active).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        style: styles.section,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: styles.kicker,
                children: "Where The Chair Has Been"
            }, void 0, false, {
                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                lineNumber: 81,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.statusRow,
                children: [
                    activeLocation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: styles.liveDot,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                                lineNumber: 87,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: styles.statusText,
                                children: [
                                    "Currently in ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: activeLocation.name
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                                        lineNumber: 89,
                                        columnNumber: 28
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                                lineNumber: 88,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                        lineNumber: 86,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: styles.statusTextMuted,
                        children: "The Chair is between stops right now"
                    }, void 0, false, {
                        fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                        lineNumber: 93,
                        columnNumber: 21
                    }, this),
                    pastCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: styles.stopCount,
                        children: [
                            pastCount,
                            " location",
                            pastCount === 1 ? "" : "s",
                            " visited"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                        lineNumber: 98,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                lineNumber: 84,
                columnNumber: 13
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.mapLoading,
                children: "Loading locations..."
            }, void 0, false, {
                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                lineNumber: 106,
                columnNumber: 17
            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.mapError,
                children: "Couldn't load the map right now. Please try again shortly."
            }, void 0, false, {
                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                lineNumber: 108,
                columnNumber: 17
            }, this) : locations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.mapLoading,
                children: "The Chair hasn't visited anywhere yet, check back soon."
            }, void 0, false, {
                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                lineNumber: 112,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.mapWrapper,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Map, {
                    locations: locations,
                    visitors: visitors
                }, void 0, false, {
                    fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                    lineNumber: 117,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
                lineNumber: 116,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/the-chair-listens/app/components/ChairJourneyMap.jsx",
        lineNumber: 80,
        columnNumber: 9
    }, this);
}
_s(ChairJourneyMap, "PhTUaiFKSBnHFibeUlOWu6lER5s=");
_c1 = ChairJourneyMap;
const styles = {
    section: {
        width: "100%",
        maxWidth: "440px",
        margin: "0 auto",
        padding: "8px 0"
    },
    kicker: {
        display: "block",
        fontSize: "12px",
        fontWeight: 700,
        color: "#B99B5B",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "16px"
    },
    statusRow: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "16px"
    },
    liveDot: {
        width: "9px",
        height: "9px",
        borderRadius: "50%",
        backgroundColor: "#8FD19E",
        boxShadow: "0 0 0 0 rgba(143, 209, 158, 0.6)",
        animation: "chairLivePulse 1.8s infinite",
        flexShrink: 0
    },
    statusText: {
        fontSize: "13.5px",
        color: "#7E88AC"
    },
    statusTextMuted: {
        fontSize: "13.5px",
        color: "#7E88AC",
        fontStyle: "italic"
    },
    stopCount: {
        fontSize: "12px",
        color: "#7E88AC",
        marginLeft: "auto"
    },
    mapWrapper: {
        borderRadius: "16px",
        overflow: "hidden",
        border: "1.5px solid rgba(174, 184, 214, 0.2)"
    },
    mapLoading: {
        padding: "40px 0",
        textAlign: "center",
        fontSize: "13px",
        color: "#7E88AC",
        border: "1.5px dashed rgba(174, 184, 214, 0.2)",
        borderRadius: "16px"
    },
    mapError: {
        padding: "40px 0",
        textAlign: "center",
        fontSize: "13px",
        color: "#FF6B6B",
        border: "1.5px dashed rgba(255, 107, 107, 0.3)",
        borderRadius: "16px"
    }
};
var _c, _c1;
__turbopack_context__.k.register(_c, "Map");
__turbopack_context__.k.register(_c1, "ChairJourneyMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/the-chair-listens/app/pages/index.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/styled-jsx/style.js [client] (ecmascript)");
// Destination: pages/index.jsx
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$components$2f$ChairJourneyMap$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/components/ChairJourneyMap.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$components$2f$AboutFactorOfTen$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/components/AboutFactorOfTen.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$components$2f$AdminGestureLogo$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/the-chair-listens/app/components/AdminGestureLogo.jsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const POPIA_TERMS_URL = "/consent-terms";
// Awareness-ribbon path: one continuous strand with a loop on top and two crossing tails.
const RIBBON_PATH = "M24 118 L50 70 C58 55 70 40 66 22 C62 4 36 6 34 22 C32 38 42 56 50 70 L76 118";
// The piece of the first strand that passes OVER the second at the crossing.
const RIBBON_OVER = "M37 94 L50 70 C54 63 58 57 61 51";
/* Ochre circle with the blue prostate cancer awareness ribbon and sparkle rays */ function RibbonBadge() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "art-badge",
        role: "img",
        "aria-label": "Blue prostate cancer awareness ribbon",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 160 160",
            xmlns: "http://www.w3.org/2000/svg",
            "aria-hidden": "true",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "badge-gold",
                        cx: "35%",
                        cy: "30%",
                        r: "85%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: "#dcb676"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 27,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: "#bc9553"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 28,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                        lineNumber: 26,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                    lineNumber: 25,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    stroke: "#bc9553",
                    strokeWidth: "4.5",
                    strokeLinecap: "round",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            className: "badge-ray ray-a",
                            x1: "134.5",
                            y1: "62.2",
                            x2: "145.8",
                            y2: "58.1"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 33,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            className: "badge-ray ray-b",
                            x1: "121",
                            y1: "41",
                            x2: "129.5",
                            y2: "32.5"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 34,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            className: "badge-ray ray-a",
                            x1: "25.5",
                            y1: "62.2",
                            x2: "14.2",
                            y2: "58.1"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 35,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            className: "badge-ray ray-b",
                            x1: "39",
                            y1: "41",
                            x2: "30.5",
                            y2: "32.5"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 36,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                    lineNumber: 32,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "80",
                    cy: "82",
                    r: "44",
                    fill: "url(#badge-gold)"
                }, void 0, false, {
                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                    lineNumber: 39,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    transform: "translate(60 57) scale(0.4)",
                    fill: "none",
                    strokeLinejoin: "round",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: RIBBON_PATH,
                            stroke: "#0b4f99",
                            strokeWidth: "18",
                            strokeLinecap: "round"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 42,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: RIBBON_PATH,
                            stroke: "#1f82dc",
                            strokeWidth: "12",
                            strokeLinecap: "round"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: RIBBON_OVER,
                            stroke: "#0b4f99",
                            strokeWidth: "18"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 44,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: RIBBON_OVER,
                            stroke: "#2a8fe8",
                            strokeWidth: "12"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
            lineNumber: 24,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
        lineNumber: 19,
        columnNumber: 7
    }, this);
}
_c = RibbonBadge;
/* Matching ochre circle with a quotation mark, used by the community messages */ function QuoteBadge() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "voices-badge",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 80 80",
            xmlns: "http://www.w3.org/2000/svg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "quote-gold",
                        cx: "35%",
                        cy: "30%",
                        r: "85%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: "#dcb676"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: "#bc9553"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    stroke: "#d1b071",
                    strokeWidth: "3.5",
                    strokeLinecap: "round",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            className: "badge-ray ray-a",
                            x1: "71",
                            y1: "30.7",
                            x2: "77.6",
                            y2: "28.3"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            className: "badge-ray ray-b",
                            x1: "63.3",
                            y1: "18.7",
                            x2: "68.3",
                            y2: "13.7"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            className: "badge-ray ray-a",
                            x1: "9",
                            y1: "30.7",
                            x2: "2.4",
                            y2: "28.3"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            className: "badge-ray ray-b",
                            x1: "16.7",
                            y1: "18.7",
                            x2: "11.7",
                            y2: "13.7"
                        }, void 0, false, {
                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "40",
                    cy: "42",
                    r: "26",
                    fill: "url(#quote-gold)"
                }, void 0, false, {
                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    x: "40",
                    y: "67",
                    textAnchor: "middle",
                    fontFamily: "Georgia, serif",
                    fontSize: "48",
                    fill: "#19362f",
                    children: "“"
                }, void 0, false, {
                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
            lineNumber: 56,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
        lineNumber: 55,
        columnNumber: 7
    }, this);
}
_c1 = QuoteBadge;
function FourPointStar({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z",
            fill: "currentColor"
        }, void 0, false, {
            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
            lineNumber: 88,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
        lineNumber: 87,
        columnNumber: 7
    }, this);
}
_c2 = FourPointStar;
function Home({ locationName = "Pretoria" }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [consented, setConsented] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [detectedLocation, setDetectedLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeMessageIndex, setActiveMessageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [messagesPaused, setMessagesPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [aboutOpen, setAboutOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // State for community messages fetched from backend
    const [participantMessages, setParticipantMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([
        "Some days, getting out of bed is already a brave thing.",
        "You do not have to have all the answers today.",
        "I am learning that asking for help is a kind of strength.",
        "To anyone carrying a lot right now: you are not alone.",
        "Small steps still count. Give yourself credit for them.",
        "I hope you find one gentle moment for yourself today."
    ]);
    // Fetch live community messages on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            async function fetchMessages() {
                try {
                    const res = await fetch("/api/messages");
                    const data = await res.json();
                    if (data.messages && data.messages.length > 0) {
                        setParticipantMessages(data.messages.map({
                            "Home.useEffect.fetchMessages": (m)=>m.message
                        }["Home.useEffect.fetchMessages"]));
                    }
                } catch (err) {
                    console.error("Failed to load community messages:", err);
                }
            }
            fetchMessages();
        }
    }["Home.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (messagesPaused || participantMessages.length === 0) return;
            const interval = setInterval({
                "Home.useEffect.interval": ()=>{
                    setActiveMessageIndex({
                        "Home.useEffect.interval": (current)=>(current + 1) % participantMessages.length
                    }["Home.useEffect.interval"]);
                }
            }["Home.useEffect.interval"], 4500);
            return ({
                "Home.useEffect": ()=>clearInterval(interval)
            })["Home.useEffect"];
        }
    }["Home.useEffect"], [
        messagesPaused,
        participantMessages.length
    ]);
    // --------------------------------------------------
    // Detect visitor location
    // --------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") === "undefined" || !navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition({
                "Home.useEffect": async (position)=>{
                    const { latitude, longitude } = position.coords;
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                        const data = await res.json();
                        const place = data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.suburb || null;
                        if (place) {
                            setDetectedLocation(place);
                        }
                    } catch (err) {
                        console.error("Reverse geocoding failed:", err);
                    }
                }
            }["Home.useEffect"], {
                "Home.useEffect": (err)=>{
                    console.error("Geolocation unavailable:", err);
                }
            }["Home.useEffect"]);
        }
    }["Home.useEffect"], []);
    const displayLocation = detectedLocation || locationName;
    // --------------------------------------------------
    // Continue
    // --------------------------------------------------
    async function handleContinue() {
        if (!consented) return;
        try {
            await fetch("/api/consent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    location_id: displayLocation
                })
            });
        } catch (error) {
            console.error("Consent request failed:", error);
        }
        router.push({
            pathname: "/check-in",
            query: {
                location: displayLocation
            }
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "jsx-fb8fe3e558169306" + " " + "chair-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "fb8fe3e558169306",
                children: '@import "https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap";:root{--forest:#2d5046;--forest-dark:#203f36;--forest-deep:#19362f;--forest-ink:#1d4538;--mint:#8dcf94;--mint-bright:#a5dfa9;--mint-pale:#c9e6cb;--powder-blue:#d4e9ed;--powder-blue-dark:#b8dbe0;--powder-pale:#dcedef;--chair-blue:#315da8;--chair-blue-dark:#24498c;--chair-blue-light:#4775c5;--wood-light:#d9a062;--wood-dark:#b07334;--cream:#f5f2e8;--white:#fbfaf5;--ochre:#bc9553;--ochre-light:#d1b071;--sage:#526b61}*{box-sizing:border-box}html,body{background:var(--forest);margin:0;padding:0}body{overflow-x:hidden}button,input{font:inherit}.chair-page{background:radial-gradient(circle at 100% 0%, #8dcf9433, transparent 28%), radial-gradient(circle at 0% 90%, #d4e9ed1a, transparent 25%), var(--forest);width:100%;min-height:100dvh;color:var(--white);padding:max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));font-family:Benton Sans,Helvetica Neue,Arial,sans-serif}.chair-shell{width:100%;max-width:1180px;margin:0 auto}.topbar{justify-content:space-between;align-items:center;gap:12px;min-height:56px;padding:6px 3px 16px;display:flex}.brand{color:var(--white);letter-spacing:.005em;align-items:center;gap:9px;font-family:Plus Jakarta Sans,Benton Sans,Helvetica Neue,Arial,sans-serif;font-size:14px;font-weight:700;display:flex}.brand-logo{object-fit:cover;border:1.5px solid #f5f2e8b3;border-radius:50%;flex:0 0 40px;width:40px;height:40px}.brand-mark{background:var(--mint);border-radius:50%;flex:none;width:10px;height:10px;box-shadow:0 0 0 4px #8dcf9424,0 0 18px #8dcf9466}.location-pill{color:var(--forest-dark);letter-spacing:.01em;background:#b9e2bf;border-radius:100px;flex-shrink:0;align-items:center;gap:8px;padding:9px 16px;font-size:12px;font-weight:700;display:inline-flex;box-shadow:0 6px 16px #0a1e182e}.header-actions{flex-shrink:0;justify-content:flex-end;align-items:center;gap:8px;display:flex}@media (width<=420px){.topbar{gap:8px}.brand{gap:7px;font-size:12px}.brand-logo{flex-basis:34px;width:34px;height:34px}.header-actions{gap:5px}.location-pill{padding:8px 12px;font-size:11px}}.location-pill-dot{background:#1c2b25;border-radius:50%;width:7px;height:7px}.hero{background:linear-gradient(180deg, #fbf7ea 0%, var(--cream) 100%);min-height:0;color:var(--forest);isolation:isolate;border-radius:38px;flex-direction:column;display:flex;position:relative;overflow:hidden;box-shadow:0 26px 54px #08181361,inset 0 1px #ffffffb3}.hero:before{content:"";background:var(--powder-pale);z-index:-1;border-radius:50%;width:360px;height:360px;position:absolute;top:-190px;right:-150px}.hero:after{content:"";opacity:.9;z-index:-1;background:#cfe6ea;border-radius:50%;width:300px;height:300px;position:absolute;bottom:-170px;right:-120px}.hero-copy{text-align:center;z-index:2;flex-direction:column;align-items:center;padding:36px 23px 0;display:flex;position:relative}.hero-copy>*{animation:.65s cubic-bezier(.2,.7,.2,1) both hero-rise}.hero-copy>:first-child{animation-delay:40ms}.hero-copy>:nth-child(2){animation-delay:.12s}.hero-copy>:nth-child(3){animation-delay:.2s}.hero-copy>:nth-child(4){animation-delay:.28s}.hero-copy>:nth-child(5){animation-delay:.36s}.hero-copy>:nth-child(6){animation-delay:.44s}@keyframes hero-rise{0%{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}.eyebrow{color:var(--forest-ink);letter-spacing:.22em;text-transform:uppercase;justify-content:center;align-items:center;gap:11px;margin-bottom:18px;font-size:10px;font-weight:800;display:flex}.eyebrow-line{background:var(--ochre);border-radius:2px;width:28px;height:2px}.hero-title{letter-spacing:-.06em;color:var(--forest-ink);margin:0;font-family:Plus Jakarta Sans,Benton Sans,Helvetica Neue,Arial,sans-serif;font-size:max(58px,min(18vw,80px));font-weight:800;line-height:.86}.hero-line{display:block}.hero-line.accent{color:var(--mint)}.script-line{color:var(--ochre);margin:18px 0 12px;font-family:Pinyon Script,cursive;font-size:44px;line-height:1;transform:none}.hero-description{color:#234a3f;max-width:320px;margin:6px 0 0;font-size:15px;font-weight:500;line-height:1.5}.hero-description strong{color:var(--forest-ink);font-weight:800}.hero-subtext{color:#5d6f68;max-width:300px;margin:16px 0 0;font-size:13px;line-height:1.55}.about-link{border:2px solid var(--ochre);color:#1f2a25;letter-spacing:-.005em;cursor:pointer;background:#fcf8ec;border-radius:100px;margin:20px 0 0;padding:13px 26px;font-size:14px;font-weight:800;transition:background .16s,color .16s,transform .16s,box-shadow .16s;box-shadow:0 8px 18px #bc955333}.about-link:hover{background:var(--ochre);color:var(--white);transform:translateY(-2px);box-shadow:0 12px 24px #bc955352}.about-link:focus-visible{outline:3px solid var(--forest);outline-offset:3px}.hero-art{justify-content:center;align-items:center;height:345px;min-height:345px;margin-top:0;display:flex;position:relative;overflow:hidden}.art-circle{background:var(--mint-pale);border-radius:50%;width:270px;height:270px;position:absolute;box-shadow:inset 0 0 0 1px #ffffff73}.art-badge{z-index:3;filter:drop-shadow(0 10px 14px #19362f33);width:124px;height:124px;animation:5s ease-in-out infinite badge-bob;position:absolute;top:6px;right:4px}.art-badge svg{width:100%;height:100%;display:block;overflow:visible}.badge-ray{animation:2.6s ease-in-out infinite ray-twinkle}.badge-ray.ray-b{animation-delay:.7s}@keyframes badge-bob{0%,to{translate:0}50%{translate:0 -7px}}@keyframes ray-twinkle{0%,to{opacity:1}50%{opacity:.35}}.art-star{width:26px;height:26px;color:var(--forest);animation:3.2s ease-in-out infinite star-twinkle;position:absolute;bottom:62px;left:26px}.art-star-2{width:15px;height:15px;color:var(--mint);animation:3.2s ease-in-out 1.1s infinite star-twinkle;position:absolute;top:62px;left:58px}.art-dot{background:var(--ochre);opacity:.55;border-radius:50%;position:absolute}.art-dot.one{width:8px;height:8px;bottom:38px;left:90px}.art-dot.two{background:var(--chair-blue);opacity:.35;width:6px;height:6px;bottom:78px;right:74px}@keyframes star-twinkle{0%,to{opacity:1;scale:1}50%{opacity:.5;scale:.82}}.chair{z-index:2;filter:drop-shadow(0 18px 16px #23426433);width:250px;height:295px;position:relative;transform:none}.chair-floor{z-index:-1;background:radial-gradient(#19362f4d,#0000 70%);border-radius:50%;width:206px;height:22px;position:absolute;top:300px;left:22px}.chair-back{background:linear-gradient(135deg, var(--chair-blue-light) 0%, var(--chair-blue) 45%, var(--chair-blue-dark) 100%);border-radius:62px 62px 22px 22px;width:155px;height:190px;position:absolute;top:12px;left:48px;box-shadow:inset 9px 0 #ffffff14,inset -9px 0 #0019461f}.chair-back:before,.chair-back:after{content:"";background:radial-gradient(circle at 35% 30%,#5d88cf,#1f4c92);border-radius:50%;width:11px;height:11px;position:absolute;top:62px;box-shadow:0 1px 2px #00143c4d,inset 0 -1px 1px #00143c40}.chair-back:before{left:43px}.chair-back:after{left:101px}.chair-seat{background:linear-gradient(180deg, #5583cc, var(--chair-blue) 55%, var(--chair-blue-dark));border-radius:20px;width:194px;height:60px;position:absolute;top:188px;left:30px;box-shadow:inset 0 7px #ffffff1f,inset 0 -10px #00143c1a,0 8px #1d3c75}.chair-seat:after{content:"";background:#00194638;border-radius:2px;height:2px;position:absolute;top:26px;left:12px;right:12px}.chair-arm-left,.chair-arm-right{border-radius:22px 22px 14px 14px;width:36px;height:100px;position:absolute;top:150px}.chair-arm-left{background:linear-gradient(90deg, var(--chair-blue-light), var(--chair-blue) 60%, var(--chair-blue-dark));left:14px;transform:rotate(-4deg)}.chair-arm-right{background:linear-gradient(270deg, var(--chair-blue-light), var(--chair-blue) 60%, var(--chair-blue-dark));right:14px;transform:rotate(4deg)}.chair-leg{background:linear-gradient(90deg, var(--wood-light), var(--wood-dark));clip-path:polygon(0 0,100% 0,76% 100%,24% 100%);transform-origin:top;border-radius:3px 3px 0 0;width:13px;height:68px;position:absolute;top:244px}.chair-leg.left{left:50px;transform:rotate(10deg)}.chair-leg.right{right:50px;transform:rotate(-10deg)}.chair-leg.back-left{filter:brightness(.86);height:58px;top:236px;left:80px;transform:rotate(5deg)}.chair-leg.back-right{filter:brightness(.86);height:58px;top:236px;right:80px;transform:rotate(-5deg)}.action-card{z-index:5;background:var(--forest-dark);border-radius:21px;flex-direction:column;gap:15px;width:calc(100% - 20px);margin:-18px auto 0;padding:18px;display:flex;position:relative;box-shadow:0 14px 35px #112d2547}.consent{cursor:pointer;color:#dce9df;text-align:left;align-items:flex-start;gap:10px;font-size:11px;line-height:1.5;display:flex}.consent input{width:18px;height:18px;accent-color:var(--mint);cursor:pointer;flex:0 0 18px;margin:1px 0 0}.consent a{color:var(--mint);text-underline-offset:3px;text-decoration-thickness:1px}.consent a:hover{color:var(--white)}.continue-button{background:var(--mint);width:100%;color:var(--forest-dark);cursor:pointer;border:0;border-radius:100px;padding:15px 20px;font-size:14px;font-weight:800;transition:transform .16s,background .16s,box-shadow .16s}.continue-button:hover:not(:disabled){background:var(--mint-bright);transform:translateY(-2px);box-shadow:0 8px 20px #8dcf942e}.continue-button:active:not(:disabled){transform:scale(.98)}.continue-button:focus-visible{outline:2px solid var(--white);outline-offset:3px}.continue-button:disabled{opacity:.35;cursor:not-allowed}.intro-strip{background:#ffffff1a;border-radius:21px;flex-direction:column;gap:1px;margin-top:35px;display:flex;overflow:hidden}.intro-item{background:#ffffff09;min-height:125px;padding:23px}.intro-item:nth-child(2){background:var(--powder-blue);color:var(--forest)}.intro-item:nth-child(3){background:var(--mint);color:var(--forest)}.intro-number{color:var(--ochre);letter-spacing:.14em;margin-bottom:10px;font-size:9px;font-weight:800;display:block}.intro-item:nth-child(2) .intro-number,.intro-item:nth-child(3) .intro-number{color:var(--forest);opacity:.55}.intro-title{letter-spacing:-.02em;margin:0 0 6px;font-size:18px}.intro-text{opacity:.7;max-width:300px;margin:0;font-size:12px;line-height:1.5}.community-voices{background:#19362fb8;border:1px solid #f5f2e81f;border-radius:23px;margin-top:38px;padding:25px 18px 18px;overflow:hidden;box-shadow:0 15px 34px #112d251f}.voices-heading{justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:18px;display:flex}.voices-kicker{color:var(--mint);letter-spacing:.15em;text-transform:uppercase;margin-bottom:7px;font-size:9px;font-weight:800}.voices-title{color:var(--white);letter-spacing:-.045em;margin:0;font-size:max(22px,min(4vw,30px));line-height:1.05}.voices-badge{filter:drop-shadow(0 6px 10px #00000038);flex:0 0 58px;width:58px;height:58px;margin:-4px -2px 0 0;animation:5s ease-in-out infinite badge-bob;display:block}.voices-badge svg{width:100%;height:100%;display:block;overflow:visible}.message-window{background:var(--cream);width:100%;min-height:190px;color:var(--forest);text-align:left;cursor:pointer;border:1px solid #2d50461a;border-radius:18px;flex-direction:column;align-items:stretch;padding:24px 21px 18px;transition:transform .18s,background .18s;display:flex;position:relative;overflow:hidden}.message-window:hover{background:var(--white);transform:translateY(-2px)}.message-window:focus-visible{outline:3px solid var(--ochre-light);outline-offset:4px}.message-quote-mark{height:31px;color:var(--ochre);font-family:Georgia,serif;font-size:54px;line-height:.9}.participant-message{color:var(--forest);letter-spacing:-.025em;overflow-wrap:anywhere;flex:1;margin:5px 0 22px;font-size:max(17px,min(3vw,22px));font-weight:600;line-height:1.45;animation:.42s both message-arrive;display:block}.message-bottom-row{border-top:1px solid #2d50461f;justify-content:space-between;align-items:center;gap:12px;padding-top:13px;display:flex}.message-attribution,.message-control{color:var(--sage);letter-spacing:.04em;text-transform:uppercase;align-items:center;gap:7px;font-size:9px;font-weight:800;display:inline-flex}.message-anonymous-dot{background:var(--mint);border-radius:50%;flex:0 0 7px;width:7px;height:7px;box-shadow:0 0 0 3px #8dcf9433}.message-control{color:var(--forest);white-space:nowrap}.message-progress{background:#2d504614;height:3px;position:absolute;bottom:0;left:0;right:0}.message-progress-bar{transform-origin:0;background:var(--ochre);width:100%;height:100%;animation:4.5s linear forwards message-progress;display:block;transform:scaleX(0)}.message-progress-bar.paused{animation-play-state:paused}.voices-note{color:#ffffff94;text-align:center;margin:13px 3px 0;font-size:10px;line-height:1.6}@keyframes message-arrive{0%{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}@keyframes message-progress{0%{transform:scaleX(0)}to{transform:scaleX(1)}}.journey{background:var(--powder-blue);color:var(--forest);border-radius:23px;margin-top:42px;padding:27px 18px;overflow:hidden}.journey-header{margin-bottom:22px;display:block}.journey-kicker{color:var(--sage);letter-spacing:.16em;text-transform:uppercase;margin-bottom:8px;font-size:9px;font-weight:800}.journey-title{letter-spacing:-.055em;margin:0;font-size:39px;line-height:.92}.journey-script{color:var(--ochre);white-space:normal;margin-top:14px;font-family:Pinyon Script,cursive;font-size:34px;line-height:1;transform:none}.journey-map{-webkit-overflow-scrolling:touch;background:#ffffff7a;border-radius:16px;width:100%;padding:12px;overflow-x:auto}.footer{text-align:center;border-top:1px solid #f5f2e829;flex-direction:column;align-items:center;gap:6px;margin:24px 0 0;padding-top:20px;display:flex}.footer-brand{color:var(--mint-bright);letter-spacing:.15em;font-size:11px;font-weight:800}.footer-tagline{color:#f5f2e894;font-size:11px}.footer-disclaimer{color:#f5f2e880;max-width:520px;margin:10px 0 0;font-size:10px;line-height:1.6}.footer-disclaimer a{color:var(--mint);text-underline-offset:3px;text-decoration-thickness:1px}.footer-disclaimer a:hover{color:var(--white)}@media (width<=360px){.brand-logo{flex-basis:30px;width:30px;height:30px}.hero-copy{padding-left:18px;padding-right:18px}.hero-title{font-size:54px}.script-line{font-size:38px}.hero-art{height:310px;min-height:310px}.art-circle{width:235px;height:235px}.art-badge{width:100px;height:100px;top:4px;right:0}.chair{transform:scale(.86)}.journey-title{font-size:34px}}@media (width>=700px){.chair-page{padding:18px}.brand{gap:12px;font-size:22px}.brand-logo{flex-basis:54px;width:54px;height:54px}.location-pill{padding:10px 22px;font-size:14px}.hero{border-radius:44px;grid-template-columns:1fr .9fr;min-height:620px;display:grid}.hero:before{width:440px;height:440px;top:-210px;right:-150px}.hero:after{width:360px;height:360px;bottom:-190px;right:-130px}.hero-copy{text-align:left;align-items:flex-start;padding:62px 30px 55px 60px}.eyebrow{justify-content:flex-start;font-size:12px}.eyebrow-line{width:40px}.hero-title{font-size:max(70px,min(8.5vw,108px))}.script-line{font-size:58px}.hero-description{max-width:440px;font-size:18px}.hero-subtext{max-width:420px;font-size:14px}.about-link{padding:15px 32px;font-size:16px}.hero-art{height:auto;min-height:600px}.art-circle{width:440px;height:440px}.art-badge{width:176px;height:176px;top:26px;right:26px}.art-star{width:34px;height:34px;bottom:100px;left:50px}.art-star-2{width:20px;height:20px;top:120px;left:90px}.art-dot.one{bottom:70px;left:130px}.art-dot.two{bottom:130px;right:120px}.chair{width:330px;height:400px;transform:none}.chair-floor{width:270px;height:26px;top:410px;left:30px}.chair-back{width:205px;height:255px;top:25px;left:63px}.chair-back:before,.chair-back:after{width:14px;height:14px;top:86px}.chair-back:before{left:58px}.chair-back:after{left:133px}.chair-seat{width:254px;height:76px;top:255px;left:40px}.chair-seat:after{top:34px}.chair-arm-left,.chair-arm-right{width:48px;height:132px;top:205px}.chair-arm-left{left:18px}.chair-arm-right{right:18px}.chair-leg{width:17px;height:92px;top:326px}.chair-leg.left{left:66px}.chair-leg.right{right:66px}.chair-leg.back-left,.chair-leg.back-right{height:76px;top:318px}.chair-leg.back-left{left:106px}.chair-leg.back-right{right:106px}.action-card{grid-template-columns:1fr auto;align-items:center;width:calc(100% - 90px);margin-top:-45px;padding:25px 30px;display:grid}.continue-button{width:auto;min-width:150px}.intro-strip{grid-template-columns:repeat(3,1fr);display:grid}.journey{padding:48px}.journey-header{justify-content:space-between;align-items:flex-end;display:flex}.journey-title{font-size:max(40px,min(5vw,58px))}.journey-script{margin-top:0;font-size:42px}.voices-badge{flex-basis:72px;width:72px;height:72px}.footer{text-align:center;flex-direction:column;justify-content:center}}@media (width<=420px){.community-voices{padding:21px 13px 15px}.message-window{min-height:205px;padding:20px 16px 17px}.message-bottom-row{flex-direction:column;align-items:flex-start;gap:9px}}@media (prefers-reduced-motion:reduce){*,:before,:after{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}}'
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-fb8fe3e558169306" + " " + "chair-shell",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "jsx-fb8fe3e558169306" + " " + "topbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "brand",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$components$2f$AdminGestureLogo$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "brand-logo",
                                        src: "/logos/factor-of-ten-logo.jpg",
                                        alt: "Factor of Ten Foundation logo"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 1947,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "jsx-fb8fe3e558169306" + " " + "brand-mark"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 1953,
                                        columnNumber: 15
                                    }, this),
                                    "The Chair Listens"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 1946,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "header-actions",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-fb8fe3e558169306" + " " + "location-pill",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-fb8fe3e558169306" + " " + "location-pill-dot"
                                        }, void 0, false, {
                                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                            lineNumber: 1960,
                                            columnNumber: 17
                                        }, this),
                                        displayLocation
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                    lineNumber: 1959,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 1958,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                        lineNumber: 1945,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "jsx-fb8fe3e558169306" + " " + "hero",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "hero-copy",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-fb8fe3e558169306" + " " + "eyebrow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-fb8fe3e558169306" + " " + "eyebrow-line"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 1973,
                                                columnNumber: 17
                                            }, this),
                                            "A space to pause",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-fb8fe3e558169306" + " " + "eyebrow-line"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 1975,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 1972,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "jsx-fb8fe3e558169306" + " " + "hero-title",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-fb8fe3e558169306" + " " + "hero-line",
                                                children: "The"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 1979,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-fb8fe3e558169306" + " " + "hero-line",
                                                children: "Chair"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 1980,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-fb8fe3e558169306" + " " + "hero-line accent",
                                                children: "Listens."
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 1981,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 1978,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-fb8fe3e558169306" + " " + "script-line",
                                        children: "Take a seat"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 1984,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-fb8fe3e558169306" + " " + "hero-description",
                                        children: [
                                            "The ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "jsx-fb8fe3e558169306",
                                                children: "Chair"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 1989,
                                                columnNumber: 21
                                            }, this),
                                            " gives men a quiet, anonymous place to be heard and to learn about prostate health, so that talking and getting checked feel a little easier."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 1988,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setAboutOpen(true),
                                        className: "jsx-fb8fe3e558169306" + " " + "about-link",
                                        children: "Small Acts. Tenfold Impact."
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 1994,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-fb8fe3e558169306" + " " + "hero-subtext",
                                        children: "Sit for a minute. Say what’s on your mind. No names. No judgement. Just a moment to be heard."
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2002,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 1971,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "hero-art",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-fb8fe3e558169306" + " " + "art-circle"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2013,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RibbonBadge, {}, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2015,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FourPointStar, {
                                        className: "art-star"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2017,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FourPointStar, {
                                        className: "art-star-2"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2018,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "jsx-fb8fe3e558169306" + " " + "art-dot one"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2019,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "jsx-fb8fe3e558169306" + " " + "art-dot two"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2020,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-fb8fe3e558169306" + " " + "chair",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "chair-floor"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2023,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "chair-back"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2025,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "chair-arm-left"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2027,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "chair-arm-right"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2029,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "chair-leg back-left"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2031,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "chair-leg back-right"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2033,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "chair-seat"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2035,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "chair-leg left"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2037,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "chair-leg right"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2039,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2022,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2012,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                        lineNumber: 1970,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "jsx-fb8fe3e558169306" + " " + "action-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "popia-consent",
                                className: "jsx-fb8fe3e558169306" + " " + "consent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "popia-consent",
                                        type: "checkbox",
                                        checked: consented,
                                        onChange: (e)=>setConsented(e.target.checked),
                                        className: "jsx-fb8fe3e558169306"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2053,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-fb8fe3e558169306",
                                        children: [
                                            "I confirm I am 18 or older (or participating with parent/guardian supervision) and agree to anonymously participate. I have read and accepted the",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: POPIA_TERMS_URL,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "jsx-fb8fe3e558169306",
                                                children: "POPIA Privacy Notice & Consent Terms"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2066,
                                                columnNumber: 17
                                            }, this),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2060,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2049,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleContinue,
                                disabled: !consented,
                                className: "jsx-fb8fe3e558169306" + " " + "continue-button",
                                children: "Take a seat"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2077,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                        lineNumber: 2048,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "jsx-fb8fe3e558169306" + " " + "intro-strip",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "intro-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-fb8fe3e558169306" + " " + "intro-number",
                                        children: "01 / PAUSE"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2093,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-fb8fe3e558169306" + " " + "intro-title",
                                        children: "Take a breath."
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2097,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-fb8fe3e558169306" + " " + "intro-text",
                                        children: "Step away from the noise and give yourself a minute."
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2101,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2092,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "intro-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-fb8fe3e558169306" + " " + "intro-number",
                                        children: "02 / SPEAK"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2108,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-fb8fe3e558169306" + " " + "intro-title",
                                        children: "Say what you feel."
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2112,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-fb8fe3e558169306" + " " + "intro-text",
                                        children: "Type it out or speak naturally. There is no right answer."
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2116,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2107,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "intro-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-fb8fe3e558169306" + " " + "intro-number",
                                        children: "03 / LISTEN"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2123,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-fb8fe3e558169306" + " " + "intro-title",
                                        children: "You are heard."
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2127,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-fb8fe3e558169306" + " " + "intro-text",
                                        children: "Your words become part of something bigger, anonymously."
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2131,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2122,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                        lineNumber: 2091,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        "aria-label": "Messages from the community",
                        className: "jsx-fb8fe3e558169306" + " " + "community-voices",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "voices-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-fb8fe3e558169306",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "voices-kicker",
                                                children: "A few words from the community"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2148,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-fb8fe3e558169306" + " " + "voices-title",
                                                children: "You are not sitting alone."
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2152,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2147,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuoteBadge, {}, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2157,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setMessagesPaused((paused)=>!paused),
                                "aria-pressed": messagesPaused,
                                "aria-label": messagesPaused ? "Resume rotating messages" : "Pause rotating messages to read",
                                className: "jsx-fb8fe3e558169306" + " " + "message-window",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "jsx-fb8fe3e558169306" + " " + "message-quote-mark",
                                        children: "“"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2171,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-fb8fe3e558169306" + " " + "participant-message",
                                        children: participantMessages[activeMessageIndex]
                                    }, activeMessageIndex, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2175,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-fb8fe3e558169306" + " " + "message-bottom-row",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-fb8fe3e558169306" + " " + "message-control",
                                            children: messagesPaused ? "Paused · tap to play ▷" : "Tap to pause Ⅱ"
                                        }, void 0, false, {
                                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                            lineNumber: 2183,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2182,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "jsx-fb8fe3e558169306" + " " + "message-progress",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-fb8fe3e558169306" + " " + `message-progress-bar${messagesPaused ? " paused" : ""}`
                                        }, `${activeMessageIndex}-${messagesPaused}`, false, {
                                            fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                            lineNumber: 2191,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2190,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2160,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-fb8fe3e558169306" + " " + "voices-note",
                                children: "Anonymous words shared by our community members."
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2200,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                        lineNumber: 2142,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "jsx-fb8fe3e558169306" + " " + "journey",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "journey-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-fb8fe3e558169306",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fb8fe3e558169306" + " " + "journey-kicker",
                                                children: "The Chair's journey"
                                            }, void 0, false, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2212,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-fb8fe3e558169306" + " " + "journey-title",
                                                children: [
                                                    "Where we've",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                        className: "jsx-fb8fe3e558169306"
                                                    }, void 0, false, {
                                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                        lineNumber: 2218,
                                                        columnNumber: 19
                                                    }, this),
                                                    "been sitting."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                                lineNumber: 2216,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2211,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-fb8fe3e558169306" + " " + "journey-script",
                                        children: "Come sit with us."
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2223,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2210,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fb8fe3e558169306" + " " + "journey-map",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$components$2f$ChairJourneyMap$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                    lineNumber: 2229,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2228,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                        lineNumber: 2209,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: "jsx-fb8fe3e558169306" + " " + "footer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-fb8fe3e558169306" + " " + "footer-brand",
                                children: "FACTOR OF TEN"
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2238,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-fb8fe3e558169306" + " " + "footer-tagline",
                                children: "Know more. Ask more. Check sooner."
                            }, void 0, false, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2242,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-fb8fe3e558169306" + " " + "footer-disclaimer",
                                children: [
                                    "The Chair Listens offers awareness and reflection, not medical advice, diagnosis or crisis care. If you have symptoms or concerns, speak to a doctor or clinic. If you are in danger or distress, use the",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/emergency",
                                        className: "jsx-fb8fe3e558169306",
                                        children: "emergency resources"
                                    }, void 0, false, {
                                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                        lineNumber: 2251,
                                        columnNumber: 15
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                                lineNumber: 2246,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                        lineNumber: 2237,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                lineNumber: 1940,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$components$2f$AboutFactorOfTen$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                open: aboutOpen,
                onClose: ()=>setAboutOpen(false)
            }, void 0, false, {
                fileName: "[project]/the-chair-listens/app/pages/index.jsx",
                lineNumber: 2259,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/the-chair-listens/app/pages/index.jsx",
        lineNumber: 212,
        columnNumber: 7
    }, this);
}
_s(Home, "GGjDVgUt/t45iFPaDZMx50zrYEA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$the$2d$chair$2d$listens$2f$app$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c3 = Home;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "RibbonBadge");
__turbopack_context__.k.register(_c1, "QuoteBadge");
__turbopack_context__.k.register(_c2, "FourPointStar");
__turbopack_context__.k.register(_c3, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime/runtime-types.d.ts" />
/// <reference path="../../../shared/runtime/dev-globals.d.ts" />
/// <reference path="../../../shared/runtime/dev-protocol.d.ts" />
/// <reference path="../../../shared/runtime/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateB.type === 'total') {
        // A total update replaces the entire chunk, so it supersedes any prior update.
        return updateB;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0gajtj-._.js.map