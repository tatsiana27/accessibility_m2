(function() {
  // const burger = document.querySelector(".burger");
  // const menu = document.querySelector("#" + burger.dataset.target);
  // burger.addEventListener("click", function() {
  //   burger.classList.toggle("is-active");
  //   menu.classList.toggle("is-active");
  // });

  const keys = {
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    enter: 13,
    space: 32,
    esc: 27,
    tab: 9,
  };

  const direction = {
    37: -1,
    38: -1,
    39: 1,
    40: 1
  };

  const burger = document.querySelector('.burger');
  const menu = document.querySelector('#menu');
  const menuItems = document.querySelectorAll('#menu a');

  burger.addEventListener('click', function(){
    toggleMainNavigation(this);
  });

  burger.addEventListener('keydown', function(event){
    if((event.keyCode === keys.enter) || (event.keyCode === keys.space)) {
      toggleMainNavigation(event.currentTarget);
    }
  });

  for (let i = 0; i < menuItems.length; ++i) {
    menuItems[i].addEventListener('keydown', keyupMenuEventListener);
    menuItems[i].index = i;
  }

  function keyupMenuEventListener(event) {
    const key = event.keyCode;

    switch (key) {
      case keys.end:
        event.preventDefault();
        menuItems[menuItems.length - 1].focus();
        break;
      case keys.home:
        event.preventDefault();
        menuItems[0].focus();
        break;

      case keys.up:
      case keys.down:
      case keys.left:
      case keys.right:
        event.preventDefault();
        switchMenuItemsOnArrowPress(event);
        break;

      case keys.esc:
        toggleMainNavigation(burger);
        burger.focus();
        break;
    };
  }

  function switchMenuItemsOnArrowPress(event) {
    const pressed = event.keyCode;

    if (direction[pressed]) {
      const target = event.target;
      if (target.index !== undefined) {
        if (menuItems[target.index + direction[pressed]]) {
          menuItems[target.index + direction[pressed]].focus();
        }
        else if (pressed === keys.left || pressed === keys.up) {
          menuItems[menuItems.length - 1].focus();
        }
        else if (pressed === keys.right || pressed == keys.down) {
          menuItems[0].focus();
        };
      };
    };
  }

  function toggleMainNavigation(burgerButton) {
    if (menu.classList.contains('is-active')) {
      burgerButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-active');
      burgerButton.classList.remove('is-active');
    } else {
      burgerButton.classList.add('is-active');
      menu.classList.add('is-active');
      burgerButton.setAttribute('aria-expanded', 'true');
      menuItems[0].focus();
    }
  }

  const tabItems = document.querySelectorAll('[role="tab"]');
  const panelItems = document.querySelectorAll('[role="tabpanel"]');

  for (let i = 0; i < tabItems.length; ++i) {
    addListeners(i);
  }

  function addListeners (index) {
    tabItems[index].addEventListener('click', clickEventListener);
    tabItems[index].addEventListener('keydown', keydownEventListener);
    tabItems[index].addEventListener('keyup', keyupEventListener);

    tabItems[index].index = index;
  }

  function clickEventListener (event) {
    const tab = event.currentTarget;
    activateTab(tab, false);
  }

  function keydownEventListener (event) {
    const key = event.keyCode;

    switch (key) {
      case keys.end:
        event.preventDefault();
        activateTab(tabItems[tabItems.length - 1]);
        break;
      case keys.home:
        event.preventDefault();
        activateTab(tabItems[0]);
        break;

      case keys.up:
      case keys.down:
        event.preventDefault();
        switchTabOnArrowPress(event);
        break;
    };
  }

  function keyupEventListener (event) {
    const key = event.keyCode;

    switch (key) {
      case keys.left:
      case keys.right:
        switchTabOnArrowPress(event);
        break;
    };
  }

  function switchTabOnArrowPress (event) {
    const pressed = event.keyCode;

    if (direction[pressed]) {
      const target = event.target;
      if (target.index !== undefined) {
        if (tabItems[target.index + direction[pressed]]) {
          activateTab(tabItems[target.index + direction[pressed]], false);
        }
        else if (pressed === keys.left || pressed === keys.up) {
          activateTab(tabItems[tabItems.length - 1]);
        }
        else if (pressed === keys.right || pressed == keys.down) {
          activateTab(tabItems[0]);
        };
      };
    };
  }

  function activateTab (tab, setFocus) {
    setFocus = setFocus || true;
    deactivateTabs();

    tab.removeAttribute('tabindex');
    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('is-active');
    tab.setAttribute('tabindex', '0');
    const controls = tab.getAttribute('aria-controls');

    document.getElementById(controls).removeAttribute('hidden');
    document.getElementById(controls).classList.add('is-active');
    if (setFocus) {
      tab.focus();
    };
  };

  function deactivateTabs () {
    for (let j = 0; j < tabItems.length; j++) {
      tabItems[j].setAttribute('tabindex', '-1');
      tabItems[j].setAttribute('aria-selected', 'false');
      tabItems[j].classList.remove('is-active');
    };

    for (let k = 0; k < panelItems.length; k++) {
      panelItems[k].setAttribute('hidden', 'hidden');
      panelItems[k].classList.remove('is-active');
    };
  };
})();

document.querySelectorAll("#nav li").forEach(function(navEl) {
  navEl.onclick = function() {
    toggleTab(this.id, this.dataset.target);
  };
});

function addNewPost() {
  document.querySelector(".will-change").textContent = "New post was added!";
}

setTimeout(addNewPost, 5000);

function toggleTab(selectedNav, targetId) {
  var navEls = document.querySelectorAll("#nav li");

  navEls.forEach(function(navEl) {
    if (navEl.id == selectedNav) {
      navEl.classList.add("is-active");
    } else {
      if (navEl.classList.contains("is-active")) {
        navEl.classList.remove("is-active");
      }
    }
  });

  var tabs = document.querySelectorAll(".tab-pane");

  tabs.forEach(function(tab) {
    if (tab.id == targetId) {
      tab.style.display = "block";
    } else {
      tab.style.display = "none";
    }
  });
}
