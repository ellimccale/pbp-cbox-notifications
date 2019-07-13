/**!
 * Plugin Name: Cbox Notifications
 * Plugin URI:  http://ellitest.proboards.com
 * Author:      Elli
 * Author URI:  http://ellimccale.com/
 * Version:     0.2.0
 */

(function () {

    var PLUGIN_ID = 'cbox_notifications';
    var ELEMENT_ID = 'cbox-notifications';
    var DIALOG_ID = 'js-' + ELEMENT_ID + '-dialog';
    var BUTTON_ID = 'js-' + ELEMENT_ID + '-button';
    var BUTTON_CLASS = ELEMENT_ID + '__button';
    var NOTIFICATION_CLASS = ELEMENT_ID + '__notification';

    var settings = {};

    var hasNewMessage = false;
    var isDialogOpen = false;

    var $cboxButton;
    var $cboxNotification;

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

        var isDialogDraggable = (settings.is_dialog_draggable === 'true');

        pb.window.dialog(DIALOG_ID, {

            autoOpen: false,
            draggable: isDialogDraggable,
            height: settings.dialog_height,
            modal: true,
            resizable: false,
            title: settings.dialog_title,
            width: settings.dialog_width,

            open: function (e, ui) {
                console.log('The dialog should be open.');
                isDialogOpen = true;
            },

            close: function (e, ui) {
                console.log('The dialog should be closed.');
                isDialogOpen = false;
            }

        });

        $('#' + DIALOG_ID).html(_buildDialogContent());

    }

    function _buildDialogContent() {

        return $('<iframe>').attr({

            allowtransparency: 'yes',
            frameborder: '0',
            height: '99%',
            marginheight: '0',
            marginwidth: '0',
            scrolling: 'auto',
            src: settings.cbox_url,
            width: '100%',

        });

    }

    function _buildButton() {

        $cboxButton = $('<button>').attr({
            id: BUTTON_ID,
            class: BUTTON_CLASS,
            type: 'button',
        });

        $cboxButton.addClass(
            _getElementPosition(BUTTON_CLASS, settings.button_position)
        );

        var buttonSize = settings.button_size;

        if (buttonSize === 'button_small') {
            $cboxButton.addClass(BUTTON_CLASS + '--small');
        } else if (buttonSize === 'button_large') {
            $cboxButton.addClass(BUTTON_CLASS + '--large');
        }

        $cboxButton.css({
            'background-color': '#' + settings.button_bg_color,
            'border': settings.button_border,
            'color': '#' + settings.button_text_color,
        });

        $cboxButton.html(_buildButtonContent());

        $cboxButton.on('click', function () {
            _removeNotification();
            $('#' + DIALOG_ID).dialog('open');
        });

        $('body').append($cboxButton);

    }

    function _buildButtonContent() {

        var buttonContent = '';
        var showButtonIcon = (settings.show_button_icon === 'true');
        var showButtonText = (settings.show_button_text === 'true');

        if (showButtonIcon) {

            var buttonIcon = '';
            
            if (settings.image_or_font === 'image') {
                buttonIcon += '<i aria-hidden="true"><img src="' + settings.button_icon_image + '" alt="" /></i>';
            } else if (settings.image_or_font === 'icon_font') {
                buttonIcon += '<i class="' + settings.button_icon_font_class + '" aria-hidden="true"></i>';
            }

            buttonContent += buttonIcon;

        }

        if (showButtonText) {
            $cboxButton.addClass(BUTTON_CLASS + '--show-text');
            buttonContent += settings.button_text;
        }

        return buttonContent += '<span class="visually-hidden">Show Chat, opens a dialog window</span>';

    }

    function _fetchCboxData() {

        window.addEventListener('message', function (e) {

            if (!e || !e.data) {
                return;
            }

            if (!e.origin || !e.origin.match(/cbox.ws$/)) {
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

            if (event === 'message' && !isDialogOpen) {

                _addNotification();

                localStorage.setItem('hasNewCboxMessage', 'true');

                console.log('New message received from Cbox!');

                console.log('Notification and localStorage item were added! The dialog should be closed.');
            }

        });

    }

    function _fetchStorageData() {

        if (localStorage.getItem('hasNewCboxMessage') === 'true') {
            _addNotification();
            console.log('localStorage remembered to add a notification. The dialog should be closed.');
        }

    }

    function _addNotification() {

        if (!hasNewMessage) {

            hasNewMessage = true;

            _buildNotification();

            $cboxButton.prepend($cboxNotification);

        }

    }

    function _removeNotification() {

        if (hasNewMessage) {

            hasNewMessage = false;

            $cboxNotification.remove();

            localStorage.removeItem('hasNewCboxMessage');

            console.log('Notification and localStorage item were removed! Dialog should be open.');

        }

    }

    function _buildNotification() {

        $cboxNotification = $('<span>').attr({
            class: NOTIFICATION_CLASS,
        });

        $cboxNotification.addClass(
            _getElementPosition(NOTIFICATION_CLASS, settings.notification_position)
        );

        $cboxNotification.css({
            'background-color': '#' + settings.notification_bg_color,
            'border': settings.notification_border,
        });

        $cboxNotification.html('<span class="visually-hidden">New Message</span>');

    }

    function _getElementPosition(selector, position) {

        if (position === 'top-left') {
            return selector + '--top-left';
        } else if (position === 'top-right') {
            return selector + '--top-right';
        } else if (position === 'bottom-right') {
            return selector + '--bottom-right';
        } else if (position === 'bottom-left') {
            return selector + '--bottom-left';
        }

    }

    _init();

})();