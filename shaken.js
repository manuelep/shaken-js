/*!
	Shaken, not stirred. A refreshing way to drink JavaScript.
	Licensed under the MIT licenses.
	More information at: http://www.opensource.org
	Copyright (c) 2021-2022 Manuele Pesenti

	revision: 1.0
*/

function compileTemplate (template, directives, notOverwite) {
    /**
     * Function that apply the Shaken-js DOM elements compilation logic.
     * template @element : The template HTML element.
     *     data-name and data-case attributes will be used for element compilation.
     *     1. If only data-name is specified the corresponding value in the directives will replace the tag inner text.
     *     2. If data-case is specified the corresponding value in the directives will replace the specied tag attribute.
     * directives @object :
     *     {"<key>": "<value>", "<key>": [{"<key>": "<value>", ...}, ...]}
     *     - If value is a list the conteined objects will be used as directives for the identified element child.
     *
     * notOverwite @boolean : (default false)
     */
    Object.entries(directives).forEach(([name, value]) => {
        let elements = template.querySelectorAll(`[data-name='${name}']`);
        for ( let el of elements ) {

            if ( Array.isArray(value) ) {
                let elCase = document.createElement('div');
                value.forEach(subDirective => {
                    let newContainer = el.cloneNode(true);
                    compileTemplate(newContainer, subDirective);
                    elCase.appendChild(newContainer);
                });
                if ( notOverwite ) {
                    el.parentNode.innerHTML += elCase.innerHTML;
                } else {
                    el.parentNode.innerHTML = elCase.innerHTML;
                };
                return template;
            } else {
                if ( el.hasAttribute('data-child') ) {
                    let subel = el.querySelector(el.getAttribute('data-child'));
                    if ( el.hasAttribute('data-case') ) {
                        let attribute = el.getAttribute('data-case');
                        subel.setAttribute(attribute, value);
                    } else {
                        subel.innerHTML = '';
                        subel.appendChild(document.createTextNode(value));
                    };
                }
                else if ( el.hasAttribute('data-case') ) {
                    let attribute = el.getAttribute('data-case');
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
         * A component builded up around a local DOM element.
         * element @string or @object :
         *     @string : DOM element id or HTML tag;
         *     @object : DOM element;
         *     (optional default 'div')
         * updateUrl @string : Url for updating element values;
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
    compile (directives, notOverwite) {
        return compileTemplate(this.element, directives, notOverwite)
    };
    fetchData (args, init) {
        let url = this.updateUrl;
        if ( args ) { url+=args };
        return (init ? fetch(url, init) : fetch(url)).then(resp => resp.json())
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

class RemoteComponent extends LocalComponent {
    constructor(url, element, updateUrl) {
        /*!
         * A component witch template will be retrieved at the specified url.
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
}
