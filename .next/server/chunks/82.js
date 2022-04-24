"use strict";
exports.id = 82;
exports.ids = [82];
exports.modules = {

/***/ 3928:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "l": () => (/* binding */ useNotification)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _providers_NotificationProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8389);


const useNotification = ()=>{
    const { notification , statusNotification , addNotification , removeNotification ,  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_providers_NotificationProvider__WEBPACK_IMPORTED_MODULE_1__/* .NotificationContext */ .u);
    return {
        notification,
        statusNotification,
        addNotification,
        removeNotification
    };
};


/***/ }),

/***/ 6832:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => (/* binding */ useWords)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _providers_WordsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7811);


const useWords = ()=>{
    const { englishWords , russianWords , setWord , updateWord , deleteWord  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_providers_WordsProvider__WEBPACK_IMPORTED_MODULE_1__/* .WordsContext */ .d);
    return {
        englishWords,
        russianWords,
        setWord,
        updateWord,
        deleteWord
    };
};


/***/ }),

/***/ 8389:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u": () => (/* binding */ NotificationContext),
/* harmony export */   "J": () => (/* binding */ NotificationProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const NotificationContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext({
    notification: null,
    statusNotification: null,
    addNotification: ()=>{},
    removeNotification: ()=>{}
});
const NotificationProvider = ({ children  })=>{
    const { 0: notification , 1: setNotification  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: statusNotification , 1: setStatusNotification  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const removeNotification = ()=>setNotification(null)
    ;
    const addNotification = (message, status)=>{
        setNotification(message);
        setStatusNotification(status);
    };
    const contextValue = {
        notification,
        statusNotification,
        addNotification: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((message, status)=>addNotification(message, status)
        , []),
        removeNotification: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>removeNotification()
        , [])
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(NotificationContext.Provider, {
        value: contextValue,
        children: children
    });
};


/***/ }),

/***/ 7811:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "d": () => (/* binding */ WordsContext),
/* harmony export */   "i": () => (/* binding */ WordsProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_localStorageService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(347);
/* harmony import */ var _services_localKey__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4239);




const WordsContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext({
    englishWords: [],
    russianWords: [],
    setWord: ()=>{},
    updateWord: ()=>{},
    deleteWord: ()=>{}
});
const appGetWords = (key)=>{
    var ref;
    return (ref = _services_localStorageService__WEBPACK_IMPORTED_MODULE_2__/* .LocalStorageService.getItem */ .n.getItem(key)) !== null && ref !== void 0 ? ref : [];
};
const WordsProvider = ({ children  })=>{
    const { 0: englishWords , 1: setEnglishWords  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(appGetWords(_services_localKey__WEBPACK_IMPORTED_MODULE_3__/* .ContextKey.ENGLISH */ .Dj.ENGLISH));
    const { 0: russianWords , 1: setRussianWords  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(appGetWords(_services_localKey__WEBPACK_IMPORTED_MODULE_3__/* .ContextKey.RUSSIAN */ .Dj.RUSSIAN));
    const updateState = (key)=>{
        if (key === _services_localKey__WEBPACK_IMPORTED_MODULE_3__/* .ContextKey.ENGLISH */ .Dj.ENGLISH) {
            setEnglishWords(appGetWords(_services_localKey__WEBPACK_IMPORTED_MODULE_3__/* .ContextKey.ENGLISH */ .Dj.ENGLISH));
        } else {
            setRussianWords(appGetWords(_services_localKey__WEBPACK_IMPORTED_MODULE_3__/* .ContextKey.RUSSIAN */ .Dj.RUSSIAN));
        }
    };
    const handleAddWord = (word, key)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_2__/* .LocalStorageService.setWord */ .n.setWord(word, key);
        updateState(key);
    };
    const handleUpdateWord = (word, key)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_2__/* .LocalStorageService.updateWord */ .n.updateWord(word, key);
        updateState(key);
    };
    const handleDeleteWord = (id, key)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_2__/* .LocalStorageService.deleteWord */ .n.deleteWord(id, key);
        updateState(key);
    };
    const value = {
        englishWords,
        russianWords,
        setWord: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((word, key)=>handleAddWord(word, key)
        , []),
        updateWord: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((word, key)=>handleUpdateWord(word, key)
        , []),
        deleteWord: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((id, key)=>handleDeleteWord(id, key)
        , [])
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(WordsContext.Provider, {
        value: value,
        children: children
    });
};


/***/ })

};
;