const entitiesFunc: any = {
  initEntitiesItems(list) {
    this.entitiesState.listOfItems = list ?? [];
    this.entitiesState.fetching = false;
  },
  reFatcher() {
    this.entitiesState.fetching = true;
    this.entitiesState.alterNativewordFatching = true;
    this.entitiesState.list_of_alter_sent_panding = true;
  },
  initAlterNativeItems(list) {
    this.entitiesState.listOfAlterchunk = list ?? {};
    this.entitiesState.alterNativewordFatching = false;
  },
  setActiveAlternative(i) {
    this.entitiesState.activeAlter = i;
  },
  initAlterSentItem(list) {
    this.entitiesState.list_of_alter_sent = list ?? [];
    this.entitiesState.list_of_alter_sent_panding = false;
  },
  initAlterSentItemLoading() {
    this.entitiesState.list_of_alter_sent_panding = true;
  },
};

export default entitiesFunc;
