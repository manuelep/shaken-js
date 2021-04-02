/*!
	Shaken, not stirred. A refreshing way to drink JavaScript.
	Licensed under the MIT licenses.
	More information at: http://www.opensource.org
	Copyright (c) 2021-2022 Manuele Pesenti

	revision: 1.0
*/

function compileTemplate (template, directives) {
    /**
     * template @element : The template HTML element.
     * directives @object :
     *     {"<key>": "<value>", "<key>": [{"<key>": "<value>", ...}, ...]}
    */
    Object.entries(directives).forEach(([name, value]) => {
        let elements = template.querySelectorAll(`[data-name='${name}']`);
        for (let el of elements) {
            if ( Array.isArray(value) ) {
                let elCase = document.createElement('div');
                value.forEach(subDirective => {
                    compileTemplate(el, subDirective);
                    let newContainer = el.cloneNode(true);
                    elCase.appendChild(newContainer);
                });
                el.outerHTML = elCase.innerHTML;
                return template;
            } else {
                let attribute = el.getAttribute('data-case');
                if ( attribute ) {
                    el.setAttribute(attribute, value);
                } else {
                    el.innerHTML = '';
                    el.appendChild(document.createTextNode(value));
                };
            };
        };
    });
    return template;
};

class LocalComponent {
    constructor (element, updateUrl) {
        /*!
         * element @string or @object:
         *     @string : DOM element id or HTML tag;
         *     @object : DOM element;
         *     (optional default 'div')
         */
        this.updateUrl = updateUrl;
        if ( !element ) {
            this.element = document.createElement('div');
        } else if ( element instanceof HTMLElement ) {
            this.element = element;
        } else {
            let el = document.getElementById(element);
            if ( el ) {
                this.element = el;
            } else {
                this.element = document.createElement(element);
            };
        };
    };
    compile (directives) {
        return compileTemplate(this.element, directives)
    };
    fetchData (args, init) {
        let url = this.updateUrl;
        if ( args ) { url+=args }

        return (init ? fetch(url, {}) : fetch(url)).then(resp => resp.json()).then(response => {
            // self.compile(response.recap);
            return response;
        });
    };
    remove () {
        //
        this.element.parentNode.removeChild(this.element);
    };
    replace (oldChild, newChild) {
        oldChild.parentNode.replaceChild(newChild, oldChild);
    };
    clone () {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    };
};

//

class RemoteComponent extends LocalComponent {
    constructor(url, element, updateUrl) {
        /*!
         * url @string: Url for retrieving the pure HTML component template;
         */
        super(element, updateUrl);
        this.url = url;
        this.loaded = false;
    };
    load (replace) {
        var self = this;
        return fetch(self.url).then(resp => resp.text()).then(template => {
            if ( replace ) {
                let foo = self.element.cloneNode(true);
                foo.innerHTML = template.trim();
                self.element = foo.firstChild;
            } else {
                self.element.innerHTML = template.trim();
            };
            self.loaded = true;
            return self.element
        });
    };

    // update (init, first) {
    //     var self = this;
    //     if ( first ) {
    //         this.load().then(el => {
    //             return LocalComponent.prototype.update.call(self, init);
    //         });
    //     } else {
    //         return LocalComponent.prototype.update.call(self, init);
    //     };
    // };
}