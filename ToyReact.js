class Wrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(vchild) {
        vchild.mountTo(this.root);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

export class Component {
    constructor() {
        this.children = [];
    }
    mountTo(parent) {
        let vdom = this.render();
        vdom.mountTo(parent);
    }
    setAttribute(name,value) {
        this[name] = value;
    }
    appendChild(vchild) {
        this.children.push(vchild)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

export let ToyReact = {
    createElement(type, attributes, ...children) {
        let element;
        // console.log(attributes,arguments)
        // let element = document.createElement(type);
        console.log(element)
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
        vdom.mountTo(element);
        // element.appendChild(vdom);
    }
}

//  _ToyReact_js__WEBPACK_IMPORTED_MODULE_0__["ToyReact"]
// .createElement("span", null, "1"), _ToyReact_js__WEBPACK_IMPORTED_MODULE_0__["ToyReact"]
// .createElement("span", null, "2"), _ToyReact_js__WEBPACK_IMPORTED_MODULE_0__["ToyReact"]
// .createElement("span", null, "3"));
