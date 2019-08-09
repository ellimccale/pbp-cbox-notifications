### 1.0.1
- Changed `_buildButton` to only append a CSS positioning class if the user hasn't placed the trigger button manually
- Updated CSS positioning classes to work with the above
- Updated try...catch argument from `e` to `err` since parent already uses `e`
- Simplified function that appends notification

### 1.0.0
- Added option to make the dialog resizable
- Reduced Cbox iframe height from 99% to 98% to prevent vertical scrollbars on some forums
- Made it possible to allow custom placement of the trigger button
- Made `_buildButton` and `_buildNotification` more "pure"
- Moved some settings around in the plugin interface

### 0.2.0
- Added customization options for button and notification
- Changed `cbox_height` to `dialog_height` and moved it to dialog options
- Converted button and notification selectors to constants
- Added check to make sure Cbox `origin` exists before `match`
- Renamed localStorage item to be more unique
- Dynamically building button and notification
- Improved classnames on CSS

### 0.1.1
- Added error handling for try...catch on Cbox data

### 0.1.0
- Initial commit
