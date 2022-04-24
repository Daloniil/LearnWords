"use strict";
exports.id = 571;
exports.ids = [571];
exports.modules = {

/***/ 225:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RC": () => (/* binding */ statsTitleStyle),
/* harmony export */   "n9": () => (/* binding */ statsBoxStyle),
/* harmony export */   "d3": () => (/* binding */ scrollStatsStyle),
/* harmony export */   "yU": () => (/* binding */ indentsBoxStyle),
/* harmony export */   "Dv": () => (/* binding */ titleTestStyle),
/* harmony export */   "PX": () => (/* binding */ statBoxStyle),
/* harmony export */   "_5": () => (/* binding */ deleteButtonStyle)
/* harmony export */ });
const statsTitleStyle = {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "600"
};
const statsBoxStyle = {
    width: "80%",
    margin: "5px auto 5px auto",
    border: 2,
    borderColor: "#E0E0E0",
    borderRadius: "5px"
};
const scrollStatsStyle = {
    maxHeight: "600px",
    overflow: "hidden",
    overflowY: "scroll",
    margin: "20px 0 0 0"
};
const indentsBoxStyle = {
    padding: "0 0 0 10px",
    margin: "5px 0 5px 0",
    cursor: "pointer"
};
const titleTestStyle = {
    fontSize: "18px",
    fontWeight: "450"
};
const statBoxStyle = {
    width: "80%",
    maxHeight: "600px",
    overflow: "hidden",
    overflowY: "scroll",
    margin: "20px auto 2px auto",
    border: 2,
    borderColor: "#E0E0E0",
    borderRadius: "5px",
    cursor: "pointer"
};
const deleteButtonStyle = {
    margin: "0 10px 0 0",
    float: "right",
    cursor: "pointer"
};


/***/ }),

/***/ 9868:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "V": () => (/* binding */ useStats)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _providers_StatsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9244);


const useStats = ()=>{
    const { stats , addWord , addStats , deleteStats  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_providers_StatsProvider__WEBPACK_IMPORTED_MODULE_1__/* .StatsContext */ .q);
    return {
        stats,
        addWord,
        addStats,
        deleteStats
    };
};


/***/ })

};
;