export default {
	/**
	 * Gets last URL segment
	 * @param href
	 * @returns {string}
	 */
	getIdFromUrl: getIdFromUrl,
	getUrlWithoutId: function (href){
		let id = getIdFromUrl(href);
		if (id.length === 24) {
			return href.substr(0, href.lastIndexOf('/'));
		} else {
			return href;
		}
	}
};
function getIdFromUrl(href){
	return href.substr(href.lastIndexOf('/') + 1);
}