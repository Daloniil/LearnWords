"use strict";
exports.id = 88;
exports.ids = [88];
exports.modules = {

/***/ 6088:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x": () => (/* binding */ TestContext),
/* harmony export */   "o": () => (/* binding */ TestProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_localKey__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4239);
/* harmony import */ var _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(347);




const TestContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext({
    testWordsContext: [],
    wordVariantsContext: [],
    percentTestContext: 0,
    setTestWordsContext: ()=>{},
    setWordVariantsContext: ()=>{},
    setPercentContext: ()=>{},
    deleteTestContext: ()=>{}
});
const appGetTestWords = (key)=>{
    var ref;
    return (ref = _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.getItem */ .n.getItem(key)) !== null && ref !== void 0 ? ref : [];
};
const appGetWordVariants = (key)=>{
    var ref;
    return (ref = _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.getItem */ .n.getItem(key)) !== null && ref !== void 0 ? ref : [];
};
const appGetPercentTest = (key)=>{
    var ref;
    return (ref = _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.getItem */ .n.getItem(key)) !== null && ref !== void 0 ? ref : 0;
};
const TestProvider = ({ children  })=>{
    const { 0: testWordsContext , 1: setTestWordsContext  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(appGetTestWords(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.TEST */ .Dj.TEST));
    const { 0: wordVariantsContext , 1: setWordVariantsContext  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(appGetWordVariants(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.WORD */ .Dj.WORD));
    const { 0: percentTestContext , 1: setPercentTextContext  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(appGetPercentTest(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.PERCENT */ .Dj.PERCENT));
    const updateState = ()=>{
        setTestWordsContext(appGetTestWords(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.TEST */ .Dj.TEST));
        setWordVariantsContext(appGetWordVariants(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.WORD */ .Dj.WORD));
        setPercentTextContext(appGetPercentTest(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.PERCENT */ .Dj.PERCENT));
    };
    const handleAddTestWord = (word)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.setTestWords */ .n.setTestWords(word);
        updateState();
    };
    const handleSetWordVariants = (word)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.setWordVariants */ .n.setWordVariants(word);
        updateState();
    };
    const handleSetPercentTest = (percent)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.setPercentTest */ .n.setPercentTest(percent);
        updateState();
    };
    const handleDeleteTest = ()=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.deleteTest */ .n.deleteTest();
        updateState();
    };
    const value = {
        testWordsContext,
        wordVariantsContext,
        percentTestContext,
        setTestWordsContext: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((word)=>handleAddTestWord(word)
        , []),
        setWordVariantsContext: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((word)=>handleSetWordVariants(word)
        , []),
        deleteTestContext: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>handleDeleteTest()
        , []),
        setPercentContext: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((percent)=>handleSetPercentTest(percent)
        , [])
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(TestContext.Provider, {
        value: value,
        children: children
    });
};


/***/ })

};
;