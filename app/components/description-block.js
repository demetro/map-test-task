import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: 'tooltip',
	actions: {
		cancel: function() {
			$(".tooltip").hide();
		}
	}
});
