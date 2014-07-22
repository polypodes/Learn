/*
 * Encapsulation.js
 * Copyright (C) 2014 ronan <ronan@cider.local>
 *
 * Distributed under terms of the MIT license.
 * Source: https://gist.github.com/OiNutter/1173224
 */

var toolTip = function(){
    var _privateProp = 'foo',
    _privateMethod = function(){
        return 'bar';
    },
    publicMethod = function(){
        return _privateProp + _privateMethod();
    };

    return {
        publicMethod:publicMethod
    }

}
