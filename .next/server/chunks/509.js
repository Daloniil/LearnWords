"use strict";
exports.id = 509;
exports.ids = [509];
exports.modules = {

/***/ 3509:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "F": () => (/* binding */ useTheme)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _providers_ThemeProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6007);


const useTheme = ()=>{
    const { themeContext , setThemeContext  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_providers_ThemeProvider__WEBPACK_IMPORTED_MODULE_1__/* .ThemeContext */ .N);
    return {
        themeContext,
        setThemeContext
    };
};


/***/ }),

/***/ 6007:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": () => (/* binding */ ThemeContext),
/* harmony export */   "G": () => (/* binding */ ThemeProviderContext)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_localKey__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4239);
/* harmony import */ var _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(347);




const ThemeContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext({
    themeContext: "light",
    setThemeContext: ()=>{}
});
const appGetTheme = (key)=>{
    var ref;
    return (ref = _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.getItem */ .n.getItem(key)) !== null && ref !== void 0 ? ref : "";
};
const ThemeProviderContext = ({ children  })=>{
    const { 0: themeContext , 1: setThemeContext  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(appGetTheme(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.THEME */ .Dj.THEME));
    const handleSetLanguage = (theme)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.setTheme */ .n.setTheme(theme, _services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.THEME */ .Dj.THEME);
        setThemeContext(appGetTheme(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.THEME */ .Dj.THEME));
    };
    const value = {
        themeContext,
        setThemeContext: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((theme)=>handleSetLanguage(theme)
        , [])
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(ThemeContext.Provider, {
        value: value,
        children: children
    });
};


/***/ })

};
;