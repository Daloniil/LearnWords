"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 2461:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _app)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: ./providers/NotificationProvider.tsx
var NotificationProvider = __webpack_require__(8389);
;// CONCATENATED MODULE: external "@mui/material/Alert"
const Alert_namespaceObject = require("@mui/material/Alert");
var Alert_default = /*#__PURE__*/__webpack_require__.n(Alert_namespaceObject);
;// CONCATENATED MODULE: external "@mui/material/Snackbar"
const Snackbar_namespaceObject = require("@mui/material/Snackbar");
var Snackbar_default = /*#__PURE__*/__webpack_require__.n(Snackbar_namespaceObject);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./hooks/useLanguage.ts
var useLanguage = __webpack_require__(6917);
// EXTERNAL MODULE: ./hooks/useNotification.ts
var useNotification = __webpack_require__(3928);
// EXTERNAL MODULE: ./services/localKey.ts
var localKey = __webpack_require__(4239);
;// CONCATENATED MODULE: ./translation/Notification/index.ts
const notificationTranslation = [
    {
        title: "testPassed",
        ru: "Тест пройден успешно",
        en: "Test passed successfully"
    },
    {
        title: "wordAdd",
        ru: "Слово успешно добавлено",
        en: "Word added successfully"
    },
    {
        title: "hasAlready",
        ru: "Это слово уже есть в твоем словаре",
        en: "This word has already in your words"
    },
    {
        title: "leastFive",
        ru: "В вашем словаре должно быть не менее 5 слов",
        en: "Your dictionary must have at least 5 words"
    },
    {
        title: "wordDelete",
        ru: "Слово успешно удалено",
        en: "Word deleted successfully"
    },
    {
        title: "wordEdit",
        ru: "Слово успешно изменено",
        en: "Word edited successfully"
    }, 
];

// EXTERNAL MODULE: ./utils/setTranslation.ts
var setTranslation = __webpack_require__(158);
;// CONCATENATED MODULE: ./components/Notification/index.tsx









const Notification = ()=>{
    const { notification , statusNotification , removeNotification  } = (0,useNotification/* useNotification */.l)();
    const { languageContext  } = (0,useLanguage/* useLanguage */.Z)();
    const translation = (key)=>{
        return (0,setTranslation/* setTranslation */._)(key, notificationTranslation, languageContext);
    };
    return /*#__PURE__*/ jsx_runtime_.jsx((Snackbar_default()), {
        anchorOrigin: {
            vertical: "top",
            horizontal: "center"
        },
        open: !!notification,
        onClose: removeNotification,
        sx: {
            width: "300px",
            margin: "0 auto 0 auto"
        },
        children: /*#__PURE__*/ jsx_runtime_.jsx((Alert_default()), {
            elevation: 6,
            variant: "filled",
            severity: statusNotification === localKey/* NotificationKeys.SUCCESS */.dr.SUCCESS ? localKey/* NotificationKeys.SUCCESS */.dr.SUCCESS : localKey/* NotificationKeys.ERROR */.dr.ERROR,
            children: translation(notification !== null && notification !== void 0 ? notification : "") && translation(notification !== null && notification !== void 0 ? notification : "")
        })
    });
};

// EXTERNAL MODULE: ./providers/WordsProvider.tsx
var WordsProvider = __webpack_require__(7811);
// EXTERNAL MODULE: external "@mui/material"
var material_ = __webpack_require__(5692);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
var router_default = /*#__PURE__*/__webpack_require__.n(router_);
;// CONCATENATED MODULE: external "@mui/material/styles"
const styles_namespaceObject = require("@mui/material/styles");
;// CONCATENATED MODULE: external "@mui/material/AppBar"
const AppBar_namespaceObject = require("@mui/material/AppBar");
var AppBar_default = /*#__PURE__*/__webpack_require__.n(AppBar_namespaceObject);
;// CONCATENATED MODULE: external "@mui/material/Toolbar"
const Toolbar_namespaceObject = require("@mui/material/Toolbar");
var Toolbar_default = /*#__PURE__*/__webpack_require__.n(Toolbar_namespaceObject);
;// CONCATENATED MODULE: external "@mui/material/Typography"
const Typography_namespaceObject = require("@mui/material/Typography");
var Typography_default = /*#__PURE__*/__webpack_require__.n(Typography_namespaceObject);
;// CONCATENATED MODULE: external "@mui/material/IconButton"
const IconButton_namespaceObject = require("@mui/material/IconButton");
var IconButton_default = /*#__PURE__*/__webpack_require__.n(IconButton_namespaceObject);
;// CONCATENATED MODULE: external "@mui/icons-material/Menu"
const Menu_namespaceObject = require("@mui/icons-material/Menu");
var Menu_default = /*#__PURE__*/__webpack_require__.n(Menu_namespaceObject);
;// CONCATENATED MODULE: ./components/Bar/index.tsx







const Bar = ({ title , setOpen  })=>{
    const drawerWidth = 240;
    const AppBar = (0,styles_namespaceObject.styled)((AppBar_default()))(({ theme  })=>({
            zIndex: 1,
            marginLeft: drawerWidth,
            width: `100%`,
            transition: theme.transitions.create([
                "width",
                "margin"
            ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
            backgroundColor: "#32cd32"
        })
    );
    return /*#__PURE__*/ jsx_runtime_.jsx(AppBar, {
        position: "absolute",
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)((Toolbar_default()), {
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx((IconButton_default()), {
                    edge: "start",
                    "aria-label": "open drawer",
                    onClick: ()=>setOpen(true)
                    ,
                    children: /*#__PURE__*/ jsx_runtime_.jsx((Menu_default()), {})
                }),
                /*#__PURE__*/ jsx_runtime_.jsx((Typography_default()), {
                    component: "h1",
                    variant: "h6",
                    color: "inherit",
                    noWrap: true,
                    sx: {
                        flexGrow: 1
                    },
                    children: title
                }),
                /*#__PURE__*/ jsx_runtime_.jsx((IconButton_default()), {
                    color: "inherit",
                    children: /*#__PURE__*/ jsx_runtime_.jsx((Typography_default()), {
                        variant: "h6",
                        color: "inherit",
                        component: "div",
                        children: "Word learning"
                    })
                })
            ]
        })
    });
};

;// CONCATENATED MODULE: external "@mui/material/Box"
const Box_namespaceObject = require("@mui/material/Box");
var Box_default = /*#__PURE__*/__webpack_require__.n(Box_namespaceObject);
;// CONCATENATED MODULE: external "@mui/material/Drawer"
const Drawer_namespaceObject = require("@mui/material/Drawer");
var Drawer_default = /*#__PURE__*/__webpack_require__.n(Drawer_namespaceObject);
;// CONCATENATED MODULE: external "@mui/material/List"
const List_namespaceObject = require("@mui/material/List");
var List_default = /*#__PURE__*/__webpack_require__.n(List_namespaceObject);
;// CONCATENATED MODULE: external "@mui/material/Divider"
const Divider_namespaceObject = require("@mui/material/Divider");
var Divider_default = /*#__PURE__*/__webpack_require__.n(Divider_namespaceObject);
;// CONCATENATED MODULE: external "@mui/material/ListItem"
const ListItem_namespaceObject = require("@mui/material/ListItem");
var ListItem_default = /*#__PURE__*/__webpack_require__.n(ListItem_namespaceObject);
;// CONCATENATED MODULE: external "@mui/material/ListItemText"
const ListItemText_namespaceObject = require("@mui/material/ListItemText");
var ListItemText_default = /*#__PURE__*/__webpack_require__.n(ListItemText_namespaceObject);
;// CONCATENATED MODULE: external "@mui/icons-material/ChevronLeft"
const ChevronLeft_namespaceObject = require("@mui/icons-material/ChevronLeft");
var ChevronLeft_default = /*#__PURE__*/__webpack_require__.n(ChevronLeft_namespaceObject);
;// CONCATENATED MODULE: ./utils/path.ts
const paths = [
    {
        en: "Entering a word",
        ru: "Добавить слово",
        pathName: "/enter"
    },
    {
        en: "Your Dictionary",
        ru: "Словарь",
        pathName: "/dictionary"
    },
    {
        en: "Start Test",
        ru: "Начать тест",
        pathName: "/test"
    },
    {
        en: "Stats",
        ru: "Статистика",
        pathName: "/stats"
    },
    {
        en: "Settings",
        ru: "Настройки",
        pathName: "/settings"
    }, 
];

;// CONCATENATED MODULE: external "@mui/styles/makeStyles"
const makeStyles_namespaceObject = require("@mui/styles/makeStyles");
var makeStyles_default = /*#__PURE__*/__webpack_require__.n(makeStyles_namespaceObject);
// EXTERNAL MODULE: ./hooks/useWords.ts
var useWords = __webpack_require__(6832);
;// CONCATENATED MODULE: ./components/Drawer/index.tsx


















const useStyles = makeStyles_default()(()=>({
        item: {
            backgroundColor: "#d3d3d3"
        },
        icon: {
            margin: "0 0 0 15px"
        }
    })
);
const DrawerBar = ({ openDrawer , setOpenDrawer  })=>{
    const { englishWords  } = (0,useWords/* useWords */.b)();
    const { addNotification  } = (0,useNotification/* useNotification */.l)();
    const { languageContext  } = (0,useLanguage/* useLanguage */.Z)();
    const { 0: drawerStatus , 1: setDrawerStatus  } = (0,external_react_.useState)(false);
    const router = (0,router_.useRouter)();
    const classes = useStyles();
    const redirect = (pathName)=>{
        if (englishWords.length <= localKey/* WordsParams.MINLENGTH */.tY.MINLENGTH && pathName === "/test") {
            addNotification("leastFive", localKey/* NotificationKeys.ERROR */.dr.ERROR);
            router_default().push("/enter");
        } else {
            router_default().push(pathName);
        }
    };
    const toggleDrawer = (open)=>(event)=>{
            if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
                return;
            }
            setDrawerStatus(open);
            setOpenDrawer(false);
        }
    ;
    (0,external_react_.useEffect)(()=>{
        if (openDrawer) {
            setDrawerStatus(openDrawer);
        }
    }, [
        openDrawer
    ]);
    return /*#__PURE__*/ jsx_runtime_.jsx((Drawer_default()), {
        anchor: "left",
        open: drawerStatus,
        onClose: toggleDrawer(false),
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)((Box_default()), {
            sx: {
                width: 250
            },
            role: "presentation",
            onClick: toggleDrawer(false),
            onKeyDown: toggleDrawer(false),
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx((IconButton_default()), {
                    onClick: toggleDrawer(false),
                    children: /*#__PURE__*/ jsx_runtime_.jsx((ChevronLeft_default()), {})
                }),
                /*#__PURE__*/ jsx_runtime_.jsx((Divider_default()), {}),
                /*#__PURE__*/ jsx_runtime_.jsx((List_default()), {
                    children: paths.map((item, index)=>{
                        return /*#__PURE__*/ jsx_runtime_.jsx((ListItem_default()), {
                            button: true,
                            onClick: ()=>redirect(item.pathName)
                            ,
                            className: item.pathName === router.asPath ? classes.item : "",
                            children: /*#__PURE__*/ jsx_runtime_.jsx((ListItemText_default()), {
                                primary: languageContext === "english" ? item.en : item.ru
                            })
                        }, index);
                    })
                })
            ]
        })
    });
};

// EXTERNAL MODULE: ./hooks/useTheme.ts
var useTheme = __webpack_require__(3509);
;// CONCATENATED MODULE: ./layouts/index.tsx














const Layout = ({ children  })=>{
    const router = (0,router_.useRouter)();
    const { englishWords  } = (0,useWords/* useWords */.b)();
    const { addNotification  } = (0,useNotification/* useNotification */.l)();
    const { languageContext  } = (0,useLanguage/* useLanguage */.Z)();
    const { themeContext  } = (0,useTheme/* useTheme */.F)();
    const { 0: mode , 1: setMode  } = (0,external_react_.useState)(localKey/* Mode.LIGHT */.AR.LIGHT);
    const { 0: open , 1: setOpen  } = (0,external_react_.useState)(false);
    const items = paths.find((path)=>path.pathName === router.asPath
    );
    const status = englishWords.length <= localKey/* WordsParams.MINLENGTH */.tY.MINLENGTH && router.asPath === "/test";
    (0,external_react_.useEffect)(()=>{
        if (status) {
            addNotification("leastFive", localKey/* NotificationKeys.ERROR */.dr.ERROR);
            router_default().push("/enter");
        }
    }, []);
    (0,external_react_.useEffect)(()=>{
        setMode(themeContext);
    }, [
        themeContext
    ]);
    const theme1 = (0,styles_namespaceObject.createTheme)({
        palette: {
            mode
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        overflow: "hidden"
                    }
                }
            }
        }
    });
    var ref, ref1;
    return /*#__PURE__*/ jsx_runtime_.jsx(styles_namespaceObject.ThemeProvider, {
        theme: theme1,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(material_.Box, {
            sx: {
                display: "flex"
            },
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(material_.CssBaseline, {}),
                /*#__PURE__*/ jsx_runtime_.jsx(Bar, {
                    title: languageContext === "english" ? (ref = items === null || items === void 0 ? void 0 : items.en) !== null && ref !== void 0 ? ref : "" : (ref1 = items === null || items === void 0 ? void 0 : items.ru) !== null && ref1 !== void 0 ? ref1 : "",
                    setOpen: setOpen
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(DrawerBar, {
                    openDrawer: open,
                    setOpenDrawer: setOpen
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)(material_.Box, {
                    component: "main",
                    sx: {
                        backgroundColor: (theme)=>theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]
                        ,
                        flexGrow: 1,
                        height: "100vh",
                        overflow: "auto"
                    },
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(material_.Toolbar, {}),
                        /*#__PURE__*/ jsx_runtime_.jsx(material_.Container, {
                            maxWidth: "lg",
                            sx: {
                                mt: 4,
                                mb: 4,
                                width: "100vw"
                            },
                            children: /*#__PURE__*/ jsx_runtime_.jsx(material_.Paper, {
                                sx: {
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column"
                                },
                                children: !status ? children : ""
                            })
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const layouts = (Layout);

// EXTERNAL MODULE: ./providers/TestProvider.tsx
var TestProvider = __webpack_require__(6088);
// EXTERNAL MODULE: ./providers/LanguageProvider.tsx
var LanguageProvider = __webpack_require__(7445);
// EXTERNAL MODULE: ./providers/StatsProvider.tsx
var StatsProvider = __webpack_require__(9244);
// EXTERNAL MODULE: ./providers/ThemeProvider.tsx
var ThemeProvider = __webpack_require__(6007);
;// CONCATENATED MODULE: ./pages/_app.tsx










const MyApp = ({ Component , pageProps  })=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(ThemeProvider/* ThemeProviderContext */.G, {
        children: /*#__PURE__*/ jsx_runtime_.jsx(LanguageProvider/* LanguageProvider */.i, {
            children: /*#__PURE__*/ jsx_runtime_.jsx(NotificationProvider/* NotificationProvider */.J, {
                children: /*#__PURE__*/ jsx_runtime_.jsx(WordsProvider/* WordsProvider */.i, {
                    children: /*#__PURE__*/ jsx_runtime_.jsx(TestProvider/* TestProvider */.o, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx(StatsProvider/* StatsProvider */.P, {
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(layouts, {
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(Component, {
                                        ...pageProps
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx(Notification, {})
                                ]
                            })
                        })
                    })
                })
            })
        })
    });
};
/* harmony default export */ const _app = (MyApp);


/***/ }),

/***/ 5692:
/***/ ((module) => {

module.exports = require("@mui/material");

/***/ }),

/***/ 1853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [426,82,244,88,509], () => (__webpack_exec__(2461)));
module.exports = __webpack_exports__;

})();