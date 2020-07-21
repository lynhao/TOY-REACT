class Wrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        if (name.match(/^on([\s\S]+)$/)) {
            let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase());
            this.root.addEventListener(eventName, value);
        }
        if (name === "className") {
            this.root.setAttribute("class", value)
        }
        this.root.setAttribute(name, value)
    }
    appendChild(vchild) {
        let range = document.createRange();
        if (this.root.children.length) {
            range.setStartAfter(this.root.lastChild);
            range.setEndAfter(this.root.lastChild);
        } else {
            range.setStart(this.root, 0);
            range.setEnd(this.root, 0);
        }
        vchild.mountTo(range);
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

export class Component {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }
    mountTo(range) {
        this.range = range;
        this.update();
    }
    update() {
        let placeholder = document.createComment("placeholder");
        let range = document.createRange();
        range.setStart(this.range.endContainer, this.range.endOffset);
        range.setEnd(this.range.endContainer, this.range.endOffset);
        range.insertNode(placeholder);

        this.range.deleteContents();

        let vdom = this.render();
        vdom.mountTo(this.range);

        // placeholder.parentNode.removeChild(placeholder)
    }
    setAttribute(name,value) {
        if (name.match(/^on([\s\S]+)$/)) {
            // console.log(RegExp.$1);
        }
        this.props[name] = value;
        this[name] = value;
    }
    appendChild(vchild) {
        this.children.push(vchild)
    }
    setState(state) {
        let merge = (oldState, newState) => {
            for(let p in newState) {
                if (typeof newState[p] === "object") {
                    if(typeof oldState[p] !== "object") {
                        oldState[p] = {};
                    }
                    merge(oldState[p], newState[p]);
                } else {
                    oldState[p] = newState[p];
                }
            }
        }
        if (!this.state && state) {
            this.state = {};
        }
        merge(this.state, state);
        this.update();
        console.log(this.state);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
        // parent.appendChild(this.root);
    }
}

export let ToyReact = {
    createElement(type, attributes, ...children) {
        let element;
        // console.log(attributes,arguments)
        // let element = document.createElement(type);
        if (typeof type === "string") {
            element = new Wrapper(type)
        } else {
            element = new type;
        }
        for (let name in attributes) {
            element.setAttribute(name, attributes[name]);
        }
        let insertChildren = (children) => {
            for(let child of children) {
                // if (typeof child === "string") {
                //     // child = document.createTextNode(child)
                //     child = new TextWrapper(child)
                // }
                if (typeof child === "object" && child instanceof Array) {
                    insertChildren(child)
                } else {
                    if (!(child instanceof Component) && 
                        !(child instanceof Wrapper) && 
                        !(child instanceof TextWrapper)) {
                        child = String(child)
                    }
                    if (typeof child === "string") {
                        child = new TextWrapper(child)
                    }
                    element.appendChild(child);
                }
            }
        }
        insertChildren(children)
        // element.appendChild(child);

        // for(let child of children) {
        //     if (typeof child === "string") {
        //         // child = document.createTextNode(child)
        //         child = new TextWrapper(child)
        //     }
        //     element.appendChild(child);
        // }
        return element;
    },
    render(vdom, element) {
        let range = document.createRange();
        if (element.children.length) {
            range.setStartAfter(element.lastChild);
            range.setEndAfter(element.lastChild);
        } else {
            range.setStart(element, 0);
            range.setEnd(element, 0);
        }

        vdom.mountTo(range);
        // element.appendChild(vdom);
    }
}

//  _ToyReact_js__WEBPACK_IMPORTED_MODULE_0__["ToyReact"]
// .createElement("span", null, "1"), _ToyReact_js__WEBPACK_IMPORTED_MODULE_0__["ToyReact"]
// .createElement("span", null, "2"), _ToyReact_js__WEBPACK_IMPORTED_MODULE_0__["ToyReact"]
// .createElement("span", null, "3"));