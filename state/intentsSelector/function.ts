const funcItems: any = {
    initEntitiesItems(list) {
      this.state.listOfItems = list ?? [];
      this.state.fetching = false;
    }
  };
  
  export default funcItems;
  