const s1 = [

    {type: "l"},
    {type: "l"},
    {type: "d"},
    {type: "d"},
    {type: "l"},
    {type: "l"},

    {type: "d"},
    {type: "l"},
    {type: "l"},
    {type: "d"},

  ];



  function validateSequence(arr) {
    // Rule 1: Must start with "l"
    if (arr[0].type !== "l") {
        return false;
    }

    for (let i = 1; i < arr.length; i++) {
        const current = arr[i];
        const prev = arr[i - 1];

        // Rule 2: No consecutive "d"
        if (current.type === "d" && prev.type === "d") {
            return false;
        }

        // Rule 3: "d" must be followed by at least one "l"
        if (current.type === "d" && arr[i + 1] && arr[i + 1].type !== "l") {
            return false;
        }
    }

    return true;
}


  console.log(validateSequence(s1))