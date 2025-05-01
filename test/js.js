function isPartOfSentence(sentence, part) {
    const words = sentence.split(/\s+/); 
    const sentenceRegex = new RegExp(`\\b${part}\\b`, 'i'); 
    
    return sentenceRegex.test(sentence);
  }

  
console.log(isPartOfSentence("this is ","This"))