const config = {
  list_config: [
    {
      randomly_add: false,
      word_list: ["বা","asd","A2"],
      latters: "Momen",
      useWord: false,
      length: 7,
      useList: true,
    },
    {
      randomly_add: false,
      word_list: ["আ",],
      latters: " ",
      useWord: true,
      length: 7,
      useList: true,
    },
    
  ],
};
function generate_word_alter(config, length = 1) {
  const list_of_items = [];
  for (let index = 0; index < length; index++) {
    let sent = "";
    for (const element of config?.list_config) {
      if (!element.randomly_add) {
        if (element.useList) {
          if (element.word_list.length != 0) {
            for (let index = 0; index < element.length; index++) {
              sent +=
              element.word_list[
                Math.floor(Math.random() * element.word_list.length)
              ];
              
            }
            
          }
        } else {
          if (element.useWord) {
            sent += element.latters;
          } else {
            for (
              let index = 0;
              index < element.length && element?.latters?.length > 0;
              index++
            ) {
              const result = element.latters.split("")[
                Math.floor(Math.random() * element.latters.length)
              ];
              if (result) {
                sent += result;
              }
            }
          }
        }
      } else {
        if (Math.round(Math.abs(Math.random() * 100)) % 2 == 0) {
          if (element.useList) {
            if (element.word_list.length != 0) {
              sent +=
                element.word_list[
                  Math.floor(Math.random() * element.word_list.length)
                ];
            }
          } else {
            if (element.useWord) {
              sent += element.latters;
            } else {
              for (
                let index = 0;
                index < element.length && element?.latters?.length > 0;
                index++
              ) {
                const result = element.latters.trim().split("")[
                  Math.floor(Math.random() * element.latters.length)
                ];
                if (result) {
                  sent += result;
                }
              }
            }
          }
        }
      }
    }
    if (sent) {
      list_of_items.push(sent);
    }
  }
  return list_of_items;
}

console.log(generate_word_alter(config));
