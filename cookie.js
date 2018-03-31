function setCookie() {
    console.log("in setCookie")
    var userID = $("#userID")[0].value
    var cookie = 'UserID' + "=" + userID + ";"
    console.log(cookie)
    document.cookie = cookie
}

function setCookieField() {
    userID = getCookie()
    $("#userID")[0].value = userID
}

function getCookie() {
    console.log("in getCookie")
    var userID = document.cookie.replace(/(?:(?:^|.*;\s*)UserID\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    console.log(userID)
    return userID
}
