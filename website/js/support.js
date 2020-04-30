currentPage = {
    destroy: function () {

    },
    init: function () {},
    update: function () {

    }
};

document.getElementById('kiwi_irc').setAttribute('src', 'https://kiwiirc.com/client/' + irc);

var emailEl = document.getElementById('emailLink');
emailEl.setAttribute('href', 'mailto:' + email);
emailEl.textContent = email;