const profileFunc: any = {
  initProfilesItems(list) {
    this.profile.listOfItems = list ?? [];
    this.profile.fetching = false;
  },
  addProfilesItems(list) {
    this.profile.listOfItems = list ?? [];
  },
  removeAll() {
    this.profile.listOfItems = [];
  },
  removeOne(id) {},
  addOne(data) {
    this.profile.listOfItems = [data, ...this.profile.listOfItems];
  },
  readyActiveProcessing(){
    this.profile.activeProfileProcessing = true;
  },
  finishActiveProcessing(obj){
    this.profile.active = obj;
    this.profile.activeProfileProcessing = false;
  },
  closeProfile(){
    this.profile.active = null;
  }
};

export default profileFunc;
