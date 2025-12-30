function Tabzy(selector) {
  this.container = document.querySelector(selector);
  if (!this.container) {
    console.error(`Tabzy: No container found for selector: ${selector}`);
    return;
  }

  this.tabs = Array.from(this.container.querySelectorAll("li a"));
  if (!this.tabs.length) {
    console.error(`Tabzy: No tabs found inside the container`);
    return;
  }

  let hasError = false;

  this.panels = this.tabs.map((tab) => {
    const panel = document.querySelector(tab.getAttribute("href"));
    if (!panel) {
      hasError = true;
      console.error(
        `Tabzy: No panels found selector: '${tab.getAttribute("href")};'`
      );
    }
    return panel;
  });

  if (hasError) return;

  this._init();
}

Tabzy.prototype._init = function () {
  this._activeTab(this.tabs[0]);

  this.tabs.forEach((tab) => {
    tab.onclick = (event) => this._handleTabClick(event, tab);
  });
};

Tabzy.prototype._handleTabClick = function (event, tab) {
  event.preventDefault();

  this._activeTab(tab);
};

Tabzy.prototype._activeTab = function (tab) {
  this.tabs.forEach((tab) => {
    tab.closest("li").classList.remove("tabzy--active");
  });

  tab.closest("li").classList.add("tabzy--active");

  this.panels.forEach((panel) => (panel.hidden = true));

  const panelActive = document.querySelector(tab.getAttribute("href"));
  panelActive.hidden = false;
};
