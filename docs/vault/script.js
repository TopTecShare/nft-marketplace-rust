const run = async () => {
  var store = document.querySelector('.store').value;
fetch("https://mintbase-mainnet.hasura.app/v1/graphql", {
  "headers": {
    "content-type": "application/json",
  },
  "body": "{\"query\":\"query MyQuery {\\n  store(where: {name: {_eq: \\\""+store+"\\\"}}) {\\n    things {\\n      tokens {\\n        id\\n        ownerId\\n      }\\n      metaId\\n    }\\n  }\\n}\",\"variables\":null,\"operationName\":\"MyQuery\"}",
  "method": "POST",
})
.then(response => response.json())
.then(function(response) { 
    var el = document.querySelector('.target');
    el.innerHTML = jsonViewer(response["data"]["store"][0]["things"], true);
  })
};



function jsonViewer(json, collapsible=false) {
    var TEMPLATES = {
        item: '<div class="json__item"><div class="json__key">%KEY%</div><div class="json__value json__value--%TYPE%">%VALUE%</div></div>',
        itemCollapsible: '<label class="json__item json__item--collapsible"><input type="checkbox" class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
        itemCollapsibleOpen: '<label class="json__item json__item--collapsible"><input type="checkbox" checked class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>'
    };

    function createItem(key, value, type){
        var element = TEMPLATES.item.replace('%KEY%', key);

        if(type == 'string') {
            element = element.replace('%VALUE%', '"' + value + '"');
        } else {
            element = element.replace('%VALUE%', value);
        }

        element = element.replace('%TYPE%', type);

        return element;
    }

    function createCollapsibleItem(key, value, type, children){
        var tpl = 'itemCollapsible';
        
        if(collapsible) {
            tpl = 'itemCollapsibleOpen';
        }
        
        var element = TEMPLATES[tpl].replace('%KEY%', key);

        element = element.replace('%VALUE%', type);
        element = element.replace('%TYPE%', type);
        element = element.replace('%CHILDREN%', children);

        return element;
    }

    function handleChildren(key, value, type) {
        var html = '';

        for(var item in value) { 
            var _key = item,
                _val = value[item];

            html += handleItem(_key, _val);
        }

        return createCollapsibleItem(key, value, type, html);
    }

    function handleItem(key, value) {
        var type = typeof value;

        if(typeof value === 'object') {        
            return handleChildren(key, value, type);
        }

        return createItem(key, value, type);
    }

    function parseObject(obj) {
        _result = '<div class="json">';

        for(var item in obj) { 
            var key = item,
                value = obj[item];

            _result += handleItem(key, value);
        }

        _result += '</div>';

        return _result;
    }
    
    return parseObject(json);
};
