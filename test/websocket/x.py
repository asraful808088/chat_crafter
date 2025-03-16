def sentModify(p, cng):
    if not cng:
        return p["gen"]
    key_list = list(cng.keys())[0] 
    name_replacement = cng[key_list] 
    split_word = p["gen"].split(" ")
    map_sent = p["map_sent"]
    new_sentence = []
    name_started = False  
    for i, tag in enumerate(map_sent):
        if tag == "B-NAME":  
            new_sentence.append(name_replacement)
            name_started = True
        elif tag == "J-NAME" and name_started: 
            continue  
        else:
            new_sentence.append(split_word[i])
    return " ".join(new_sentence)




p = {'gen': 'My name Is Asraful Islam Momen.', 'sent': 'My name Is AsrafulIslam Momen. mama Kamal', 'map_sent': ['O', 'O', 'O', 'B-NAME',"B-X","O",'B-NAME'], 'id': 'aB9ampZuifky3NY83fkAMSBaDOn9zm6h'}
cng = {
   "X":"asdas"
}

print(sentModify(p,cng))