"use strict";
exports.id = 426;
exports.ids = [426];
exports.modules = {

/***/ 6917:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ useLanguage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _providers_LanguageProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7445);


const useLanguage = ()=>{
    const { languageContext , setLanguageContext  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_providers_LanguageProvider__WEBPACK_IMPORTED_MODULE_1__/* .LanguageContext */ .A);
    return {
        languageContext,
        setLanguageContext
    };
};


/***/ }),

/***/ 7445:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": () => (/* binding */ LanguageContext),
/* harmony export */   "i": () => (/* binding */ LanguageProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_localKey__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4239);
/* harmony import */ var _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(347);




const LanguageContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext({
    languageContext: "",
    setLanguageContext: ()=>{}
});
const appGetLanguage = (key)=>{
    var ref;
    return (ref = _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.getItem */ .n.getItem(key)) !== null && ref !== void 0 ? ref : "";
};
const LanguageProvider = ({ children  })=>{
    const { 0: languageContext , 1: setLanguageContext  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(appGetLanguage(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.LANGUAGE */ .Dj.LANGUAGE).length > 0 ? appGetLanguage(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.LANGUAGE */ .Dj.LANGUAGE) : "english");
    const handleSetLanguage = (language)=>{
        _services_localStorageService__WEBPACK_IMPORTED_MODULE_3__/* .LocalStorageService.setLanguage */ .n.setLanguage(language);
        setLanguageContext(appGetLanguage(_services_localKey__WEBPACK_IMPORTED_MODULE_2__/* .ContextKey.LANGUAGE */ .Dj.LANGUAGE));
    };
    const value = {
        languageContext,
        setLanguageContext: (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((language)=>handleSetLanguage(language)
        , [])
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(LanguageContext.Provider, {
        value: value,
        children: children
    });
};


/***/ }),

/***/ 4239:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dr": () => (/* binding */ NotificationKeys),
/* harmony export */   "tY": () => (/* binding */ WordsParams),
/* harmony export */   "IY": () => (/* binding */ EnterKeys),
/* harmony export */   "rW": () => (/* binding */ LanguageKeys),
/* harmony export */   "c1": () => (/* binding */ StatusFind),
/* harmony export */   "bn": () => (/* binding */ ColorKeys),
/* harmony export */   "Dj": () => (/* binding */ ContextKey),
/* harmony export */   "AR": () => (/* binding */ Mode)
/* harmony export */ });
var NotificationKeys;
(function(NotificationKeys) {
    NotificationKeys["SUCCESS"] = "success";
    NotificationKeys["ERROR"] = "error";
})(NotificationKeys || (NotificationKeys = {}));
var WordsParams;
(function(WordsParams) {
    WordsParams[WordsParams["MAXLENGHT"] = 13] = "MAXLENGHT";
    WordsParams[WordsParams["MINLENGTH"] = 4] = "MINLENGTH";
})(WordsParams || (WordsParams = {}));
var EnterKeys;
(function(EnterKeys) {
    EnterKeys["word"] = "word";
    EnterKeys["correctTranslation"] = "correctTranslation";
})(EnterKeys || (EnterKeys = {}));
var LanguageKeys;
(function(LanguageKeys) {
    LanguageKeys["ENGLISH"] = "englishWord";
    LanguageKeys["RUSSIAN"] = "russianWord";
})(LanguageKeys || (LanguageKeys = {}));
var StatusFind;
(function(StatusFind) {
    StatusFind["OPTIONS"] = "options";
    StatusFind["LANG"] = "lang";
    StatusFind["EN"] = "EN";
    StatusFind["RU"] = "RU";
})(StatusFind || (StatusFind = {}));
var ColorKeys;
(function(ColorKeys) {
    ColorKeys["RED"] = "#ff0000";
    ColorKeys["GREEN"] = "green";
})(ColorKeys || (ColorKeys = {}));
var ContextKey;
(function(ContextKey) {
    ContextKey["STATS"] = "app-stats";
    ContextKey["PERCENT"] = "app-percent";
    ContextKey["TEST"] = "app-test";
    ContextKey["WORD"] = "app-word";
    ContextKey["LANGUAGE"] = "app-language";
    ContextKey["ENGLISH"] = "app-english";
    ContextKey["RUSSIAN"] = "app-russian";
    ContextKey["THEME"] = "app-theme";
})(ContextKey || (ContextKey = {}));
var Mode;
(function(Mode) {
    Mode["LIGHT"] = "light";
    Mode["DARK"] = "dark";
})(Mode || (Mode = {}));


/***/ }),

/***/ 347:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "n": () => (/* binding */ LocalStorageService)
/* harmony export */ });
/* harmony import */ var _localKey__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4239);

class LocalStorageService {
    static getItem(key) {
        try {
            let item = localStorage.getItem(key);
            item = item !== null && item !== void 0 ? item : sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch  {
            return null;
        }
    }
    static setWord(value, key, session = false) {
        const storage = session ? sessionStorage : localStorage;
        var ref;
        const words = (ref = LocalStorageService.getItem(key)) !== null && ref !== void 0 ? ref : [];
        value.id = words.length > 0 ? words[words.length - 1].id + 1 : 1;
        words.push(value);
        storage.setItem(key, JSON.stringify(words));
    }
    static updateWord(value, key, session = false) {
        const storage = session ? sessionStorage : localStorage;
        var ref;
        const words = (ref = LocalStorageService.getItem(key)) !== null && ref !== void 0 ? ref : [];
        const index = words.map((id)=>id.id
        ).indexOf(value.id);
        words[index] = value;
        storage.setItem(key, JSON.stringify(words));
    }
    static deleteWord(id1, key, session = false) {
        const storage = session ? sessionStorage : localStorage;
        var ref;
        const words = (ref = LocalStorageService.getItem(key)) !== null && ref !== void 0 ? ref : [];
        const index = words.map((id)=>id.id
        ).indexOf(id1);
        words.splice(index, 1);
        storage.setItem(key, JSON.stringify(words));
    }
    static setTestWords(value, session = false) {
        const storage = session ? sessionStorage : localStorage;
        storage.setItem(_localKey__WEBPACK_IMPORTED_MODULE_0__/* .ContextKey.TEST */ .Dj.TEST, JSON.stringify(value));
    }
    static setWordVariants(value, session = false) {
        const storage = session ? sessionStorage : localStorage;
        storage.setItem(_localKey__WEBPACK_IMPORTED_MODULE_0__/* .ContextKey.WORD */ .Dj.WORD, JSON.stringify(value));
    }
    static deleteTest(session = false) {
        const storage = session ? sessionStorage : localStorage;
        storage.setItem(_localKey__WEBPACK_IMPORTED_MODULE_0__/* .ContextKey.TEST */ .Dj.TEST, JSON.stringify([]));
        storage.setItem(_localKey__WEBPACK_IMPORTED_MODULE_0__/* .ContextKey.WORD */ .Dj.WORD, JSON.stringify([]));
        storage.setItem(_localKey__WEBPACK_IMPORTED_MODULE_0__/* .ContextKey.PERCENT */ .Dj.PERCENT, JSON.stringify(0));
    }
    static setPercentTest(value, session = false) {
        const storage = session ? sessionStorage : localStorage;
        storage.setItem(_localKey__WEBPACK_IMPORTED_MODULE_0__/* .ContextKey.PERCENT */ .Dj.PERCENT, JSON.stringify(value));
    }
    static setLanguage(value, session = false) {
        const storage = session ? sessionStorage : localStorage;
        storage.setItem(_localKey__WEBPACK_IMPORTED_MODULE_0__/* .ContextKey.LANGUAGE */ .Dj.LANGUAGE, JSON.stringify(value));
    }
    static addStats(key, session = false) {
        const storage = session ? sessionStorage : localStorage;
        var ref;
        const stats = (ref = LocalStorageService.getItem(key)) !== null && ref !== void 0 ? ref : [];
        const idNewStats = stats.length > 0 ? stats[stats.length - 1].id + 1 : 0;
        stats.push({
            id: idNewStats,
            stat: []
        });
        storage.setItem(key, JSON.stringify(stats));
    }
    static addWordStats(word, translation, key, session = false) {
        const storage = session ? sessionStorage : localStorage;
        var ref;
        const stats = (ref = LocalStorageService.getItem(key)) !== null && ref !== void 0 ? ref : [];
        if (stats.length > 0) {
            stats[stats.length - 1].stat.push({
                word: word,
                translation: translation
            });
        } else {
            stats.push({
                id: 0,
                stat: []
            });
        }
        storage.setItem(key, JSON.stringify(stats));
    }
    static deleteStats(value, key, session = false) {
        const storage = session ? sessionStorage : localStorage;
        var ref;
        const stats = (ref = LocalStorageService.getItem(key)) !== null && ref !== void 0 ? ref : [];
        const index1 = stats.map((id)=>id.id
        ).indexOf(value);
        stats.splice(index1, 1);
        stats.map((id, index)=>id.id > value ? stats[index].id = id.id - 1 : ""
        );
        storage.setItem(key, JSON.stringify(stats));
    }
    static setTheme(theme, key, session = false) {
        const storage = session ? sessionStorage : localStorage;
        storage.setItem(key, JSON.stringify(theme));
    }
}


/***/ }),

/***/ 158:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => (/* binding */ setTranslation)
/* harmony export */ });
const setTranslation = (key, translation, languageContext)=>{
    let sentence = "";
    translation.forEach((translate)=>{
        if (translate.title === key) {
            sentence = languageContext === "english" ? translate.en : translate.ru;
        }
    });
    return sentence;
};


/***/ })

};
;