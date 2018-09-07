
chrome.devtools.panels.elements.createSidebarPane('My SliderBar', function (sidebar) {
  sidebar.setObject({some_data: "some data to show!"});
});

chrome.devtools.panels.create(
  "Cocos",
  "static/images/icon48.png",
  "devInspector.html",
  function (panel) {
    console.log("[Cocos Creator Inspector] Dev Panel Created!");

    panel.onShown.addListener(function (window) {
      console.log("panel show");
    });
    panel.onHidden.addListener(function (window) {
      console.log("panel hide");
    });
    panel.onSearch.addListener(function (action, query) {
      console.log("panel search!");
      return false;
    });
  }
);
