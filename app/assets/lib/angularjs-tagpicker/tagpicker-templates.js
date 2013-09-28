angular.module('tagpicker.templates', ['templates/tagpicker.html']);

angular.module("templates/tagpicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tagpicker.html",
    "<span class=\"tagpicker\" ng-class=\"{'focused': focused}\" ng-click=\"triggerFocus()\">\n" +
    "  <ul tag-autocomplete>\n" +
    "    <li ng-repeat=\"tag in tags\" class=\"tag\">{{tag}} \n" +
    "      <span class=\"delete\" ng-click=\"deleteTag(tag)\">&nbsp;x</span> \n" +
    "    </li>\n" +
    "    <li class=\"new-tag\">\n" +
    "      <input placeholder=\"add a tag\" type=\"text\"  \n" +
    "        ng-model=\"currentTag\" tag-input\n" +
    "      >\n" +
    "    </li>\n" +
    "    <li class=\"results\" ng-show=\"results.length > 0\">\n" +
    "      <ul>\n" +
    "        <li class=\"result\" ng-repeat=\"result in results\"\n" +
    "          ng-class=\"{ 'selected': result == getSelection() }\"\n" +
    "          ng-mouseover=\"selectResult(result)\"\n" +
    "          ng-mousedown=\"createNewTag(result)\">{{result}}\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</span>");
}]);
