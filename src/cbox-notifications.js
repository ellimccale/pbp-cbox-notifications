/*!
 * Plugin Name: Cbox Notifications
 * Plugin URI:  http://ellitest.proboards.com
 * Author:      Elli
 * Author URI:  http://ellimccale.com/
 * Version:     0.1.1
 */

(function () {

    var PLUGIN_ID = 'cbox_notifications';
    var ELEMENT_ID = 'cbox-notifications';
    var DIALOG_ID = 'js-' + ELEMENT_ID + '-dialog';

    var settings = {};

    var hasNewMessage = false;
    var dialogIsOpen = false;

    var $cboxButton;
    var $cboxNotification = $('<span class="' + ELEMENT_ID + '-new"><span class="visually-hidden">New Message</span></span>');

    function _init() {

        _getSettings();

        $(_onDocumentReady);

    }

    function _getSettings() {

        var plugin = pb.plugin.get(PLUGIN_ID);

        if (plugin && plugin.settings) {
            settings = plugin.settings;
        }

    }

    function _onDocumentReady() {

        _buildDialog();
        _buildButton();
        _fetchCboxData();
        _fetchStorageData();

    }

    function _buildDialog() {

        var isDialogDraggable = (settings.dialog_draggable === 'true');

        pb.window.dialog(DIALOG_ID, {

            autoOpen: false,
            draggable: isDialogDraggable,
            modal: true,
            resizable: false,
            title: settings.dialog_title,
            width: settings.cbox_width,

            open: function (e, ui) {
                console.log('The dialog should be open.');
                dialogIsOpen = true;
            },

            close: function (e, ui) {
                console.log('The dialog should be closed.');
                dialogIsOpen = false;
            }

        });

        $('#' + DIALOG_ID).html(_buildDialogContent);

    }

    function _buildDialogContent() {

        return $('<iframe>').attr({

            allowtransparency: 'yes',
            frameborder: '0',
            height: parseInt(settings.cbox_height),
            marginheight: '0',
            marginwidth: '0',
            scrolling: 'auto',
            src: settings.cbox_url,
            width: '100%',

        });

    }

    function _buildButton() {

        $cboxButton = $('<button>').attr({
            id: 'js-' + ELEMENT_ID + '-button',
            class: ELEMENT_ID + '-button',
            type: 'button',
        });

        $cboxButton.html(
            '<i class="fas fa-comment" aria-hidden="true"></i>' +
            '<span class="visually-hidden">Show Chat, opens a dialog window</span>'
        );

        $cboxButton.on('click', function() {
            _removeNotification();
            $('#' + DIALOG_ID).dialog('open');
        });

        $('body').append($cboxButton);

    }

    function _fetchCboxData() {

        window.addEventListener('message', function (e) {

            if (!e || !e.data) {
                return;
            }

            if (!e.origin.match(/cbox.ws$/)) {
                return;
            }

            var cboxdata = {};

            try {
                cboxdata = JSON.parse(e.data);
            } catch (e) {
                console.error(e);
                return;
            }

            var event = cboxdata['event'];

            if (event === 'message' && !dialogIsOpen) {

                _addNotification();

                localStorage.setItem('hasNewMessage', 'true');

                console.log('New message received from Cbox!');

                console.log('Notification and localStorage item were added! The dialog should be closed.');

            }

        });

    }

    function _fetchStorageData() {

        if (localStorage.getItem('hasNewMessage') === 'true') {
            _addNotification();
            console.log('localStorage remembered to add a notification. The dialog should be closed.');
        }

    }

    function _addNotification() {

        if (!hasNewMessage) {
            hasNewMessage = true;
            $cboxButton.prepend($cboxNotification);
        }

    }

    function _removeNotification() {

        if (hasNewMessage) {

            hasNewMessage = false;

            $cboxNotification.remove();

            localStorage.removeItem('hasNewMessage');

            console.log('Notification and localStorage item were removed! Dialog should be open.');

        }

    }

    _init();

})();