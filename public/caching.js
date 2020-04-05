async function setCache({ state = null, county = null, data = null } = {}) {
    if (county && data) {
        var location = state + "_" + county;
        localStorage.setItem(location, data);
    } else if (state && data) {
        localStorage.setItem(state, data);
    }
}