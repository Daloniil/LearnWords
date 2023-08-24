// export const modalContainerStyle = {
//   display: "flex",
//   padding: "20px 0 0 0",
//   maxWidth: "650px",
//   flexWrap: "wrap",
//   justifyContent: "center",
//   minHeight: "100px",
// };
//
// export const textFieldStyle = {
//   margin: "5px 5px 10px 5px",
// };
//
// export const titleStyle = {
//   margin: "5px 0 0 0",
//   color: "#3874CB",
//   textAlign: "center",
//   borderBlockColor: "#C4C4C4",
//   fontSize: "20px",
// };
//
// export const addStyle = {
//   margin: "0 10px 0 0",
//   float: "right",
// };
//
// export const translateWord = {
//   fontSize: "16px",
//   overflowWrap: "break-word",
//   wordWrap: " break-word",
//   msHyphens: "auto",
//   mozHyphens: "auto",
//   webkitHyphens: "auto",
//   hyphens: "auto",
//   textAlign: "center",
//   margin: "5px",
// };


export const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0'
};

export const titleStyle = {
    marginBottom: '20px',
    color: "#000",
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center',
};

export const inputContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '20px'
};

export const textFieldStyle = {
    width: '100%',
    '& label.Mui-focused': {
        color: 'black',
    },
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#aaa',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'black',
        },
    },
};

export const translationContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    alignItems: 'center',
};

export const translatedBoxStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
        backgroundColor: '#f9f9f9',
    }
};

export const translateWord = {
    fontSize: '18px',
    textAlign: 'center',
    wordBreak: 'break-word'
};

export const addStyle = {
    width: '100%',
    maxWidth: '400px',
    marginTop: '20px',
    backgroundColor: '#000',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#333'
    }
};

export const loadingStyle = {
    marginTop: '10px'
};


export const speakerAndTranslationContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around'
};

export const translateWordStyle = {
    ...translateWord,
    flexBasis: '80%',
    flexGrow: 1,
    marginRight: '10px'
};