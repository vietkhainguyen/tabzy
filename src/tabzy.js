function Tabzy(selector, options = {}) {
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

  this.opt = Object.assign(
    {
      remember: false,
    },
    options
  );

  this._originalHTML = this.container.innerHTML;

  this._init();
}

Tabzy.prototype._init = function () {
  const hash = location.hash;
  const tab =
    (this.opt.remember &&
      hash &&
      this.tabs.find((tab) => tab.getAttribute("href") === hash)) ||
    this.tabs[0];

  this._activeTab(tab);

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

  if (this.opt.remember) {
    history.replaceState(null, null, tab.getAttribute("href"));
  }
};

Tabzy.prototype.switch = function (input) {
  let tabToActivate = null;

  if (typeof input === "string") {
    tabToActivate = this.tabs.find((tab) => tab.getAttribute("href") === input);
    if (!tabToActivate) {
      console.error(`Tabzy: No panel found with ID '${input}'`);
      return;
    }
  } else if (this.tabs.includes(input)) {
    tabToActivate = input;
  }

  if (!tabToActivate) {
    console.error(`Tabzy: Invalid input '${input}'`);
    return;
  }

  this._activateTab(tabToActivate);
};

Tabzy.prototype.destroy = function () {
  this.container.innerHTML = this._originalHTML;
  this.panels.forEach((panel) => (panel.hidden = false));
  this.container = null;
  this.tabs = null;
  this.panels = null;
};
