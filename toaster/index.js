/**
 * Created by lonelydawn on 2018-02-13.
 * EasyToaster - Pretty easy toaster
 * 
 * @method
 * new Toaster().default(params)
 * new Toaster().info()
 * new Toaster().success()
 * new Toaster().warning()
 * new Toaster().error()
 * 
 * @param
 * text         required
 * textAlign    default: center
 * withIcon     default: false
 * closable     default: false
 * animation    default: false
 * duration     default: 1000ms
 * 
 * @event
 * onClick
 * onAppear
 * onVanish
 */

//  Judge a css style which is supported by broswer or not.
 var isSupportCss = function (style) {
     var prefix = ['webkit', 'moz', 'ms', 'o']
     var jsStyle = []
     var supportStyle = document.documentElement.style
     // to pascal case
     var toPascalCase = function (string) {
        return string.replace(/-(\w)/g, function ($0, $1) {
            return $1.toUpperCase()
        })
     }
     // add prefix
     for (var i in prefix) {
        jsStyle.push(toPascalCase(prefix[i] + '-' + style))
     }
     jsStyle.push(toPascalCase(style))
     // judge
     for (var j in jsStyle) {
         if (jsStyle[j] in supportStyle) {
             return true
         }
     }
     return false
 }

 var Toaster = function () {
     // initial option
     var container = document.createElement('div')
     container.className = 'toaster-container'
     document.body.appendChild(container)
     var msg = function (payload) {
         var withIcon = payload.withIcon
         var closable = payload.closable
         var animation = payload.animation && isSupportCss('animation')
         var duration = payload.duration || 2000
         var onClick = payload.onClick || new Function ()
         var onAppear = payload.onAppear || new Function ()
         var onVanish = payload.onVanish || new Function ()
         if (payload.text === undefined || payload.text === null) {
             console.error('msg should not be undefined')
             return
         }
         var item = document.createElement('div')
         item.className = 'toaster-item' + ' toaster-item-' + payload.type
         var msg = document.createElement('div')
         msg.className = 'toaster-msg'
         msg.style.textAlign = payload.textAlign || 'center'
         // msg icon
         if (withIcon) {
            var icon = document.createElement('span')
            icon.className = 'toaster-icon toaster-icon-' + payload.type
            msg.appendChild(icon)
         }
         var text = document.createElement('span')
         text.className = 'toaster-text'
         text.innerHTML = '&nbsp;&nbsp;&nbsp;' + payload.text
         msg.appendChild(text)
         item.appendChild(msg)
         // close button
         if (closable) {
            var closer = document.createElement('div')
            closer.className = 'toaster-closer'
            closer.innerHTML = '&times;'
            closer.onclick = function () {
                container.removeChild(item)
            }
            item.appendChild(closer)
         }
         item.className += ' ' + (animation ? 'fade' : 'direct')
         if (animation) {
            item.style.animationDuration = duration + 'ms'
         }
         // event
         onAppear(payload)
         container.appendChild(item)
         // design animation
         var timeCounter = 0
         var timer = null
         var setTimer = function () {
             timer = setInterval(function () {
                if (timeCounter > duration - 10) {
                    //event
                    onVanish(payload)
                    container.removeChild(item)
                    clearInterval(timer)
                }
                timeCounter += 10
            }, 10)
         }
         setTimer()
         // When mouse over, stop animation.
         item.onmouseover = function () {
             item.style.animationPlayState = 'paused'
             item.style.webkitAnimationPlayState = 'paused'
             clearInterval(timer)
         }
         // Then start animation again.
         item.onmouseleave = function () {
             item.style.animationPlayState = 'running'
             item.style.webkitAnimationPlayState = 'running'
             setTimer()
         }
         // event click
         item.onclick = function () {
            onClick(payload)
         }
     }

    return {
        wait: function (params) {
            params.type = 'wait'
            msg(params)
        },
        info: function (params) {
            params.type = 'info'
            msg(params)
        },
        success: function (params) {
            params.type = 'success'
            msg(params)
        },
        warning: function (params) {
            params.type = 'warning'
            msg(params)
        },
        error: function (params) {
            params.type = 'error'
            msg(params)
        }
    }
 }