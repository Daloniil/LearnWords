"use strict";
exports.id = 244;
exports.ids = [244];
exports.modules = {

/***/ 9244:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "q": () => (/* binding */ StatsContext),
/* harmony export */   "P": () => (/* binding */ StatsProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_localKey__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4239);
/* harmony import */ var _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(347);




const StatsContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext({
    stats: [
        {
            id: 0,
            stat: []
        }
    ],
    addWord: ()=>{},
    addStats: ()=>{},
    deleteStats: ()=>{}
});
const appGetStats = (key)=>{
    var ref;
    return (ref = _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.getItem */ .n.getItem(key)) !== null && ref !== void 0 ? ref : [];
};
const StatsProvider = ({ children  })=>{
    const { 0: stats , 1: setStats  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(appGetStats(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.STATS */ .Dj.STATS));
    const handleAddWord = (word, translation)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.addWordStats */ .n.addWordStats(word, translation, _services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.STATS */ .Dj.STATS);
        setStats(appGetStats(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.STATS */ .Dj.STATS));
    };
    const handleAddStats = ()=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.addStats */ .n.addStats(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.STATS */ .Dj.STATS);
        setStats(appGetStats(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.STATS */ .Dj.STATS));
    };
    const handleDeleteStats = (id)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.deleteStats */ .n.deleteStats(id, _services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.STATS */ .Dj.STATS);
        setStats(appGetStats(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.STATS */ .Dj.STATS));
    };
    const value = {
        stats,
        addWord: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((word, translation)=>handleAddWord(word, translation)
        , []),
        addStats: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>handleAddStats()
        , []),
        deleteStats: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((id)=>handleDeleteStats(id)
        , [])
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(StatsContext.Provider, {
        value: value,
        children: children
    });
};


/***/ })

};
;