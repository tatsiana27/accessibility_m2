(function() {
  // const burger = document.querySelector(".burger");
  // const menu = document.querySelector("#" + burger.dataset.target);
  // burger.addEventListener("click", function() {
  //   burger.classList.toggle("is-active");
  //   menu.classList.toggle("is-active");
  // });


  // const skipLinks = document.querySelectorAll('.skip-link');
  //
  // for (let i = 0; i < skipLinks.length; ++i) {
  //   skipLinks[i].addEventListener('keyup', keyupSkipLinksEventListener);
  // }

  const contactUs = document.querySelector('#form-contact-us');
  const email = document.querySelector('#email');
  const addUser = document.querySelector('.add-new-user');


  const validateForm = function() {
   // e.preventDefault();

    let isValidForm = true;
    let isFirstNameValid = false;
    let isLastNameValid = false;
    let errorMessage = '';
    const phonePattern = /^\d{11}$/;
    const yearBirthPattern = /^\d{4}$/;
    const emailPattern = /^[^@]+@[^@.]+\.[^@]+$/;
    const user = {};
    const users = getUsers();

    const username = contactUs.querySelector('#username');
    const firstName = contactUs.querySelector('#firstName');
    const lastName = contactUs.querySelector('#lastName');
    const address = contactUs.querySelector('#address');
    const phone = contactUs.querySelector('#phone');
    const yearBirth = contactUs.querySelector('#yearBirth');
    const email = contactUs.querySelector('#email');


    // const { firstName, lastName, address, phone, yearBirth } = this.elements;

    // if(users && users.length > 0) {
      if(isUserNameAvailable(username.value, users)) {
        user.username = username.value;
        resetError(username, username.parentNode);

      } else {
        if (username.value) {
          errorMessage = 'This nickname is not available';
        }
        showError(username, username.parentElement, errorMessage);
        isValidForm = false;
      }
    // } else {
    //   if (username.value) {
    //     user.username = username.value;
    //     resetError(username, username.parentNode);
    //   } else {
    //     showError(username, username.parentElement, errorMessage);
    //     isValidForm = false;
    //   }
    // }

    if(firstName.value) {
      isFirstNameValid = true;
      user.firstName = firstName.value;
      resetError(firstName, firstName.parentElement);
    } else {
      showError(firstName, firstName.parentElement);
      isValidForm = false;
    }

    if(lastName.value) {
      isLastNameValid = true;
      user.lastName = lastName.value;
      resetError(lastName, lastName.parentElement);
    } else {
      showError(lastName, lastName.parentElement);
      isValidForm = false;
    }

    if(isFirstNameValid && isLastNameValid && users.length > 0 && isFirstLastNameDuplicated(firstName.value, lastName.value, users)) {
      if(!yearBirth.value) {
        enableYearOfBirthField();
        isValidForm = false;
      }
    }

    if(address.value) {
      user.address = address.value;
      resetError(address, address.parentElement);
    } else {
      showError(address, address.parentElement);
      isValidForm = false;
    }

    if(!yearBirth.hasAttribute('disabled')) {
      if(yearBirth.value && yearBirth.value.match(yearBirthPattern)) {
        user.yearBirth = yearBirth.value;
        resetError(yearBirth, yearBirth.parentElement);
      } else {
        showError(yearBirth, yearBirth.parentElement);
        isValidForm = false;
      }
    }

    if(phone.value && phone.value.match(phonePattern)) {
      user.phone = phone.value;
      resetError(phone, phone.parentElement);
    } else {
      showError(phone, phone.parentElement);
      isValidForm = false;
    }

    if(email.value && email.value.match(emailPattern)) {
      user.email = email.value;
      resetError(email, email.parentElement);
    } else {
      showError(email, email.parentElement);
      isValidForm = false;
    }

    if(isValidForm) {
      saveUser(user);
    } else {
      manageFocus();
    }

  };
  
  function showError(element, container, message) {
    const errorEl = container.querySelector(`#${element.id}-error`);

    if(message) {
      errorEl.innerHTML = message;
    }
    errorEl.classList.remove('visuallyhidden');
    element.setAttribute('aria-invalid', 'true');
    element.classList.add('is-danger');
    container.classList.add('is-danger');
  }

  function resetError(element, container) {
    const errorEl = container.querySelector(`#${element.id}-error`);

    errorEl.classList.add('visuallyhidden');
    element.setAttribute('aria-invalid', 'false');
    element.classList.remove('is-danger');
    container.classList.remove('is-danger');
  }

  function saveUser(user) {

    let users = [];

    if (localStorage.getItem('users') !== null) {
      users = getUsers();
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    }

    updateForm();
  }

  function updateForm() {
    const statusWrapper = document.querySelector('#status-wrapper');
    const successBlock = statusWrapper.querySelector('#is-success-message');
    const addUserBtn = statusWrapper.querySelector('.add-new-user');
    const form = document.querySelector('#form-contact-us');

    statusWrapper.removeAttribute('aria-describedby');
    statusWrapper.setAttribute('aria-describedby', 'is-success-message');
    successBlock.classList.remove('visuallyhidden');
    addUserBtn.classList.remove('d-none');
    addUserBtn.focus();
    form.classList.add('d-none');

  }

  function restoreForm() {
    const statusWrapper = document.querySelector('#status-wrapper');
    const successBlock = statusWrapper.querySelector('#is-success-message');
    const addUserBtn = statusWrapper.querySelector('.add-new-user');
    const form = document.querySelector('#form-contact-us');
    const controls = form.querySelectorAll('.input');
    const username = document.getElementById('username');
    username.innerHTML = 'Please enter your nickname';

    statusWrapper.removeAttribute('aria-describedby');
    successBlock.classList.add('visuallyhidden');
    addUserBtn.classList.add('d-none');
    form.reset();
    isEmailValid = false;
    form.classList.remove('d-none');
    controls[0].focus();
  }

  function manageFocus() {
    const invalidFields = contactUs.querySelectorAll('.control.is-danger');
    const yearOfBirth = contactUs.querySelector('#yearBirth');
    const statusWrapper = document.querySelector('#status-wrapper');
    const submitButton = document.querySelector('.contact-us.button');

    if(!yearOfBirth.value && !yearOfBirth.hasAttribute('disabled')) {
      yearOfBirth.focus();
    } else if (invalidFields.length > 0){
      invalidFields[0].querySelector('.input').focus();
      statusWrapper.removeAttribute('aria-describedby');
      statusWrapper.setAttribute('aria-describedby', 'is-error-message');
    } else {
      submitButton.focus();
    }
  }

  function getUsers() {
    const users = JSON.parse(localStorage.getItem('users'));
    return users ? users : [];
  }

  function isUserNameAvailable(nickname, users) {
    if(!nickname) {
      return false;
    }

    for(let i=0; i<users.length; i+=1) {
      if(users[i].username === nickname) {
        return false;
      }
    }

    return true;
  }

  function isFirstLastNameDuplicated(firstName, lastName, users) {
    for(let i=0; i<users.length; i+=1) {
      if(users[i].firstName === firstName && users[i].lastName === lastName) {
        return true;
      }
    }

    return false;
  }

  function enableYearOfBirthField() {
    contactUs.querySelector('#yearBirth').removeAttribute('disabled');
  }

  let isEmailValid = false;

  email.addEventListener('blur', function(e) {
    const emailPattern = /^[^@]+@[^@.]+\.[^@]+$/;
    const self = this;
    const emailContainer = this.parentElement;
    const emailStatus = emailContainer.querySelector('#email-status-validation');

    // if (self.value.length > 0) {
      if(!isEmailValid) {
        //self.focus();
        emailStatus.setAttribute('aria-describedby', 'is-waiting');
        document.getElementById('overlay').classList.remove('d-none');

        setTimeout(function(){
          if(self.value && self.value.match(emailPattern)) {
            emailStatus.setAttribute('aria-describedby', 'is-success-status');
            resetError(self, emailContainer);
            document.getElementById('overlay').classList.remove('d-none');
            isEmailValid = true;
            document.getElementById('overlay').classList.add('d-none');

          } else {
            emailStatus.setAttribute('aria-describedby', 'is-error-status');
            showError(self, emailContainer);
            document.getElementById('overlay').classList.add('d-none');
            validateForm();
          }
          manageFocus();
        }, 2000);
      }
    // }

  }, true);

  addUser.addEventListener('click', restoreForm);

  contactUs.addEventListener('submit', function (e) {
    e.preventDefault();
    validateForm();
  });

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
