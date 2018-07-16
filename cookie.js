var userid = undefined

function get_userid () {
    return userid
}

function get_cookie() {
    var userID = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    return userID
}

function set_cookie(c) {
    document.cookie = 'userID' + "=" + c + ";"
}

function get_url_param() {
    return window.location.hash.replace("#userid=", "")
}

function set_url_param(cookie) {
    console.log(`set url hash: ${cookie}`)
    window.location.hash = 'userid=' + cookie
}

function make_id() {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (var i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

function init_cookie() {
    var param = get_url_param()
    var cookie = get_cookie()

    console.log(`found url param ${param}`)
    console.log(`found cookie ${cookie}`)

    if (param) {
        userid = param
    } else if (cookie != "") {
        set_url_param(cookie)
        userid = cookie
    } else {
        userid = make_id()
        set_cookie(userid)
        set_url_param(userid)
    }
}


