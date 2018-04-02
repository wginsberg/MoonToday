function set_cookie(userid="") {
    if (userid == "") {
        userid = make_id()
    }
    var cookie = 'userID' + "=" + userid + ";"
    document.cookie = cookie
}

function init_cookie() {
    var param = get_parameters()
    var cookie = get_cookie()
    if (param !== null) {
        set_cookie(param)
    }
    else if (cookie != "") {
        set_url()
    } else {
        set_cookie()
        set_url()
    }
}

function get_parameters() {
    var url_string = window.location.href
    var url = new URL(url_string)
    var c = url.searchParams.get("userid")
    return c
}

function set_url() {
    var cookie = get_cookie()
    window.location.href = window.location.href + '?userid=' + cookie
}

function make_id() {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (var i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

function get_cookie() {
    var userID = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    return userID
}
