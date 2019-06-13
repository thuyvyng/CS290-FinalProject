(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['newCard'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"cell edit_card\">\n    <button type=\"button\" onclick=\"delete_card_code(this)\" class=\"remove_card_button clickable\">x</button>\n    <textarea class=\"edit_input edit_card_input\" placeholder="
    + alias4(((helper = (helper = helpers.prompt || (depth0 != null ? depth0.prompt : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prompt","hash":{},"data":data}) : helper)))
    + "></textarea>\n    <textarea class=\"edit_input edit_card_input\" placeholder="
    + alias4(((helper = (helper = helpers.answer || (depth0 != null ? depth0.answer : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"answer","hash":{},"data":data}) : helper)))
    + "></textarea>\n</div>\n";
},"useData":true});
})();