// function isPartOfSentence(sentence, part) {
//     const words = sentence.split(/\s+/);
//     const sentenceRegex = new RegExp(`\\b${part}\\b`, 'i');

//     return sentenceRegex.test(sentence);
//   }

// console.log(isPartOfSentence("this is ","This"))
// "entities": [
//     {
//       "i": "B-PASSWORD"
//     },
//     {
//       "i": "J-PASSWORD"
//     },
//     {
//       "i": "B-USERNAME"
//     },
//     {
//       "i": "J-USERNAME"
//     },
//     {
//       "i": "B-EMAIL"
//     },
//     {
//       "i": "J-EMAIL"
//     }
//   ]
import  fs  from "fs";









function generateRandomToken(options = {}) {
    const {
        minLength = 16,        
        maxLength = 32,        
        useLower = true,        
        useUpper = false,        
        useNumbers = true,     
        useSymbols = false     
    } = options;

    let characters = '';
    if (useLower) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) characters += '0123456789';
    if (useSymbols) characters += '!@#$%^&*()-_=+[]{}|;:,.<>?/';

    if (!characters) throw new Error("At least one character set must be selected.");

    const totalLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    let token = '';
    for (let i = 0; i < totalLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }

    return token;
}












function writeJsonFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
}

function updateMapwordList(dataList, mapping) {
  return dataList.map((dataObj) => {
    const newMapword = [...dataObj.mapword];
    const newWordlist = [...dataObj.wordlist];

    for (let i = 0; i < newWordlist.length; i++) {
      const word = newWordlist[i];
      if (mapping[word]) {
        newMapword[i] = mapping[word];
        if (word.includes('@')) {
          newWordlist[i] = `${generateRandomToken({ minLength: 4, maxLength: 12})}@gmail.com`;
          
        }else{
          newWordlist[i] = generateRandomToken({ minLength: 4, maxLength: 12});
        }
        
        
      }
    }

    return {
      ...dataObj,
      mainsent:newWordlist.join(' '),
      mapword: newMapword,
      wordlist: newWordlist,
    };
  });
}

const dataList = [
    {
      "mainsent": "Create account email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "account",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New account email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "account",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open account email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "account",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make account email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "account",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add account email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "account",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up account email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "account",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create profile email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "profile",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register profile email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "profile",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up profile email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "profile",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New profile email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "profile",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open profile email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "profile",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make profile email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "profile",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add profile email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "profile",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up profile email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "profile",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create user email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "user",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register user email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "user",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up user email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "user",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New user email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "user",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open user email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "user",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make user email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "user",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add user email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "user",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up user email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "user",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create login email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "login",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register login email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "login",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up login email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "login",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New login email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "login",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open login email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "login",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make login email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "login",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add login email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "login",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up login email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "login",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create account now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "account",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New account now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "account",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open account now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "account",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make account now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "account",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add account now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "account",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up account now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "account",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create profile now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "profile",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register profile now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "profile",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up profile now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "profile",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New profile now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "profile",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open profile now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "profile",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make profile now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "profile",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add profile now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "profile",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up profile now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "profile",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create user now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "user",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register user now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "user",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up user now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "user",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New user now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "user",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open user now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "user",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make user now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "user",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add user now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "user",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up user now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "user",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create login now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "login",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register login now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "login",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up login now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "login",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New login now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "login",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open login now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "login",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make login now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "login",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add login now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "login",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up login now email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "login",
        "now",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create account fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "account",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New account fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "account",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open account fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "account",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make account fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "account",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add account fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "account",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up account fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "account",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create profile fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "profile",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register profile fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "profile",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up profile fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "profile",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New profile fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "profile",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open profile fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "profile",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make profile fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "profile",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add profile fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "profile",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up profile fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "profile",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create user fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "user",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register user fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "user",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up user fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "user",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New user fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "user",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open user fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "user",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make user fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "user",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add user fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "user",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up user fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "user",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Create login fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Create",
        "login",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Register login fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Register",
        "login",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Sign up login fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Sign",
        "up",
        "login",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "New login fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "New",
        "login",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Open login fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Open",
        "login",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Make login fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Make",
        "login",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Add login fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Add",
        "login",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    },
    {
      "mainsent": "Set up login fast email exp@gmail.com username exp password QQqq!!11",
      "mapword": [
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O"
      ],
      "wordlist": [
        "Set",
        "up",
        "login",
        "fast",
        "email",
        "exp@gmail.com",
        "username",
        "exp",
        "password",
        "QQqq!!11"
      ],
      "alter": [],
      "allAlter": true,
      "reCreate": false
    }
  ];

const mapping = {
  "exp@gmail.com,": "B-EMAIL",
  "exp@gmail.com.": "B-EMAIL",
  "exp@gmail.com": "B-EMAIL",
  "QQqq!!11": "B-PASSWORD",
  "QQqq!!11,": "B-PASSWORD",
  "QQqq!!11.": "B-PASSWORD",
  "exp,": "B-USERNAME",
  "exp.": "B-USERNAME",
  exp: "B-USERNAME",
};
const updatedList = updateMapwordList(dataList, mapping);

writeJsonFile("demo_2.json", {
  data: updatedList,
});

console.log(2312321)