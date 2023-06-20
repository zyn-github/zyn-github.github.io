# Window上面的closed、opener属性

> [参考文档](https://developer.mozilla.org/en-US/docs/Web/API/Window/closed)
```javascript
// popupWindow.closed 属性可以监听到打开的页面是否关闭
let popupWindow = null;

function refreshPopupWindow() {
  if (popupWindow && !popupWindow.closed) {
    // popupWindow is open, refresh it
    popupWindow.location.reload(true);
  } else {
    // Open a new popup window
    popupWindow = window.open("popup.html", "dataWindow");
  }
}
```
> [参考文档](https://developer.mozilla.org/en-US/docs/Web/API/Window/close)
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
<button id="open">open</button>
<button id="close">close</button>
<script>
    let openedWindow;
    function openWindow() {
        openedWindow = window.open("./popup.html");
    }
    function closeOpenedWindow() {
        openedWindow.close(); // 关闭由window.open打开的页面
    }

    document.getElementById('close').addEventListener('click', ()=> {
        closeOpenedWindow() // 关闭刚才打开的页面
    })
    document.getElementById('open').addEventListener('click', ()=> {
        openWindow()
    })
</script>
</body>

</html>
```
