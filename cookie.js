function setCookie() {
    var userID = $("#userID")[0].value
    var cookie = 'UserID' + "=" + userID + ";"
    document.cookie = cookie
}

function setCookieField() {
    userID = getCookie()
    $("#userID")[0].value = userID
}

function getCookie() {
    var userID = document.cookie.replace(/(?:(?:^|.*;\s*)UserID\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    return userID
}
