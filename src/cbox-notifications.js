/**!
 * Plugin Name: Cbox Notifications
 * Plugin URI:  http://ellitest.proboards.com
 * Author:      Elli
 * Author URI:  http://ellimccale.com/
 * Version:     1.0.1
 */

(function() {

    var PLUGIN_ID = 'cbox_notifications';
    var ELEMENT_ID = 'cbox-notifications';
    var DIALOG_ID = 'js-' + ELEMENT_ID + '-dialog';
    var BUTTON_ID = 'js-' + ELEMENT_ID + '-button';
    var BUTTON_CLASS = ELEMENT_ID + '__button';
    var NOTIFICATION_ID = 'js-' + ELEMENT_ID + '-notification';
    var NOTIFICATION_CLASS = ELEMENT_ID + '__notification';

    var settings = {};

    var hasNewMessage = false;
    var isDialogOpen = false;

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
        _bindButtonEvent();
        _fetchCboxData();
        _fetchStorageData();

    }

    function _buildDialog() {

        var isDialogDraggable = (settings.is_dialog_draggable === 'true');
        var isDialogResizable = (settings.is_dialog_resizable === 'true');

        pb.window.dialog(DIALOG_ID, {

            autoOpen: false,
            draggable: isDialogDraggable,
            height: settings.dialog_height,
            modal: true,
            resizable: isDialogResizable,
            title: settings.dialog_title,
            width: settings.dialog_width,

            open: function(e, ui) {
                isDialogOpen = true;
            },

            close: function(e, ui) {
                isDialogOpen = false;
            },

        });

        $('#' + DIALOG_ID).html(_buildDialogContent());

    }

    function _buildDialogContent() {

        return $('<iframe>').attr({
            allowtransparency: 'yes',
            frameborder: '0',
            height: '98%',
            marginheight: '0',
            marginwidth: '0',
            scrolling: 'auto',
            src: settings.cbox_url,
            width: '100%',
        });

    }

    function _buildButton() {

        var $button = $('#' + BUTTON_ID);

        if (!$button.length) {

            $button = $('<button>').attr({
                id: BUTTON_ID,
                class: BUTTON_CLASS,
                type: 'button',
            });

            $('body').append($button);

            $button.addClass(
                _setElementPosition(BUTTON_CLASS, settings.button_position)
            );

        }

        var buttonSize = settings.button_size;

        if (buttonSize === 'button_small') {
            $button.addClass(BUTTON_CLASS + '--small');
        } else if (buttonSize === 'button_large') {
            $button.addClass(BUTTON_CLASS + '--large');
        }

        $button.css({
            'background-color': '#' + settings.button_bg_color,
            'border': settings.button_border,
            'color': '#' + settings.button_text_color,
        });

        $button.html(_buildButtonContent());

        return $button;

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
            $('#' + BUTTON_ID).addClass(BUTTON_CLASS + '--show-text');
            buttonContent += settings.button_text;
        }

        return buttonContent += '<span class="visually-hidden">Show Chat, opens a dialog window</span>';

    }

    function _bindButtonEvent() {

        $('#' + BUTTON_ID).on('click', function() {

            _removeNotification();

            localStorage.removeItem('hasNewCboxMessage');

            $('#' + DIALOG_ID).dialog('open');

        });

    }

    function _fetchCboxData() {

        window.addEventListener('message', function(e) {

            if (!e || !e.data) {
                return;
            }

            if (!e.origin || !e.origin.match(/cbox.ws$/)) {
                return;
            }

            var cboxdata = {};

            try {
                cboxdata = JSON.parse(e.data);
            } catch (err) {
                console.error(err);
                return;
            }

            var event = cboxdata['event'];

            if (event === 'message' && !isDialogOpen) {
                _addNotification();
                localStorage.setItem('hasNewCboxMessage', 'true');
            }

        });

    }

    function _fetchStorageData() {

        if (localStorage.getItem('hasNewCboxMessage') === 'true') {
            _addNotification();
        }

    }

    function _addNotification() {

        if (!hasNewMessage) {

            hasNewMessage = true;

            $('#' + BUTTON_ID).prepend(_buildNotification());

        }

    }

    function _removeNotification() {

        if (hasNewMessage) {

            hasNewMessage = false;

            $('#' + NOTIFICATION_ID).remove();

        }

    }

    function _buildNotification() {

        var $notification = $('<span>').attr({
            id: NOTIFICATION_ID,
            class: NOTIFICATION_CLASS,
        });

        $notification.addClass(
            _setElementPosition(NOTIFICATION_CLASS, settings.notification_position)
        );

        $notification.css({
            'background-color': '#' + settings.notification_bg_color,
            'border': settings.notification_border,
        });

        $notification.html('<span class="visually-hidden">New Message</span>');

        return $notification;

    }

    function _setElementPosition(selector, position) {

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