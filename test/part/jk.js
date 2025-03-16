// const ads = [{epoch:13},{epoch:13},{epoch:14},{epoch:15}];

// function removeUniqueEpochs(arr) {
//     const countMap = arr.reduce((acc, item) => {
//         acc[item.epoch] = (acc[item.epoch] || 0) + 1;
//         return acc;
//     }, {});

//     return arr.filter(item => countMap[item.epoch] > 1);
// }

// const result = removeUniqueEpochs(ads);
// console.log(result);  