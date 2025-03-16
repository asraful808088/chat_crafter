const modelFunc: any = {
  initModelItems(list) {
    this.model.listOfItems = list ?? [];
    this.model.fetching = false;
    if (list.length != 0) {
      this.model.active_item = list[0];
    }
  },
  reload(list,active) {
    this.model.listOfItems = list ?? [...this.model.listOfItems];

    if (active) {
      this.model.active_item = active
    }
  },
};

export default modelFunc;
