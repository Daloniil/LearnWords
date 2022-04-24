"use strict";
exports.id = 328;
exports.ids = [328];
exports.modules = {

/***/ 834:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R": () => (/* binding */ useSearch)
/* harmony export */ });
/* harmony import */ var _useWords__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6832);
/* harmony import */ var _services_localKey__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4239);


const useSearch = ()=>{
    const { englishWords: words  } = (0,_useWords__WEBPACK_IMPORTED_MODULE_0__/* .useWords */ .b)();
    const findWords = (data, key)=>{
        if (key === _services_localKey__WEBPACK_IMPORTED_MODULE_1__/* .ContextKey.ENGLISH */ .Dj.ENGLISH) {
            return words.find((item)=>item.word === data.englishWord
            );
        }
        return words.find((item)=>item.correctTranslation === data.russianWord
        );
    };
    const search = (englishWords, searchWord)=>{
        const wordsArray = [];
        englishWords.filter((word)=>{
            return word.word.toLowerCase().includes(searchWord) || word.correctTranslation.toLowerCase().includes(searchWord);
        }).forEach((e)=>{
            wordsArray.push(e);
        });
        return wordsArray;
    };
    return {
        findWords,
        search
    };
};


/***/ }),

/***/ 1360:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "n": () => (/* binding */ findLongestWord)
/* harmony export */ });
const findLongestWord = (input)=>{
    return input.split(/\W+/).reduce(function(longest, word) {
        return word.length > longest.length ? word : longest;
    }, "");
};


/***/ }),

/***/ 7381:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "P": () => (/* binding */ lowerText)
/* harmony export */ });
const lowerText = (data)=>{
    data.englishWord = data.englishWord.toLowerCase();
    data.russianWord = data.russianWord.toLowerCase();
    return data;
};


/***/ })

};
;