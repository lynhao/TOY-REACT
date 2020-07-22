class ElementWrapper {
	constructor(type) {
		this.type = type;
		this.props = Object.create(null);
		this.children = [];
	}
	setAttribute(name, value) {
		this.props[name] = value;
	}
	appendChild(vchild) {
		this.children.push(vchild.vdom);
	}
	get vdom() {
		return this;
	}
	mountTo(range) {
		this.range = range;
		let placeHolder = document.createComment('placeHolder');
		let endRange = document.createRange();
		endRange.setStart(this.range.endContainer, this.range.endOffset);
		endRange.setEnd(this.range.endContainer, this.range.endOffset);
		endRange.insertNode(placeHolder);
		range.deleteContents();
		let element = document.createElement(this.type);
		for (let name in this.props) {
			let value = this.props[name];
			if (name.match(/^on([\s\S]+)$/)) {
				let eventname = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase());
				element.addEventListener(eventname, value);
				continue;
			}
			if (name === 'className') {
				element.setAttribute('class', value);
			}

			element.setAttribute(name, value);
		}
		for (let child of this.children) {
			let range = document.createRange();
			if (element.children.length) {
				range.setStartAfter(element.lastChild);
				range.setEndAfter(element.lastChild);
			} else {
				range.setStart(element, 0);
				range.setEnd(element, 0);
			}
			child.mountTo(range);
		}
		range.insertNode(element);
	}
}

class TextWrapper {
	constructor(content) {
		this.root = document.createTextNode(content);
		this.type = '#text';
		this.children = [];
		this.props = Object.create(null);
	}
	mountTo(range) {
		this.range = range;
		range.deleteContents();
		range.insertNode(this.root);
	}
	get vdom() {
		return this;
	}
}

export class Component {
	constructor(props) {
		this.children = [];
		this.props = Object.create(null);
	}
	get type() {
		return this.constructor.name;
	}
	mountTo(range) {
		this.range = range;
		this.update();
	}
	update() {
		let vdom = this.vdom;
		if (this.oldVdom) {
			let isSameNode = (node1, node2) => {
				if (node1.type != node2.type) {
					return false;
				}
				for (let name in node1.props) {
					// if (
					// 	typeof node1.props[name] == 'function' &&
					// 	typeof node2.props[name] === 'function' &&
					// 	node1.props[name].toString() === node2.props[name].toString()
					// ) {
					// 	continue;
					// }
					if (
						typeof node1.props[name] == 'object' &&
						typeof node2.props[name] === 'object' &&
						JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])
					) {
						continue;
					}
					if (node1.props[name] !== node2.props[name]) {
						return false;
					}
				}
				if (Object.keys(node1.props).length !== Object.keys(node2.props).length) {
					return false;
				}
				return true;
			};
			let isSameTree = (node1, node2) => {
				if (!isSameNode(node1, node2)) {
					return false;
				}
				if (node1.children.length !== node2.children.length) {
					return false;
				}
				for (let i = 0; i < node1.children.length; i++) {
					if (!isSameTree(node1.children[i], node2.children[i])) {
						return false;
					}
				}
				return true;
			};
			if (isSameTree(vdom, this.oldVdom)) {
				return;
			}
			let replace = (newTree, oldTree) => {
				if (isSameTree(newTree, oldTree)) {
					return;
				}
				if (!isSameNode(newTree, oldTree)) {
					newTree.mountTo(oldTree.range);
				} else {
					for (let i = 0; i < newTree.children.length; i++) {
						replace(newTree.children[i], oldTree.children[i]);
					}
				}
			};
			replace(vdom, this.oldVdom);
		} else {
			vdom.mountTo(this.range);
		}
		this.oldVdom = vdom;
	}
	get vdom() {
		return this.render().vdom;
	}
	setAttribute(name, value) {
		this.props[name] = value;
		this[name] = value;
	}
	appendChild(child) {
		this.children.push(child);
	}
	setState(state) {
		let merge = (oldstate, newstate) => {
			for (let p in newstate) {
				if (typeof newstate[p] === 'object' && newstate[p] !== null) {
					if (typeof oldstate[p] !== 'object') {
						if (newstate[p] instanceof Array) {
							oldstate[p] = [];
						} else {
							oldstate[p] = {};
						}
					}
					merge(oldstate[p], newstate[p]);
				} else {
					oldstate[p] = newstate[p];
				}
			}
		};
		if (!this.state && state) {
			this.state = {};
		}
		merge(this.state, state);
		this.update();
	}
}

export let ToyReact = {
	createElement: (type, attributes, ...children) => {
		let element;
		if (typeof type === 'string') {
			element = new ElementWrapper(type);
		} else {
			element = new type();
		}
		for (const name in attributes) {
			element.setAttribute(name, attributes[name]);
		}
		let insertChildren = (children) => {
			for (const child of children) {
				if (child == null || child == void 0) {
					child = '';
				}
				if (typeof child === 'object' && child instanceof Array) {
					insertChildren(child);
				} else {
					if (
						!(child instanceof Component) &&
						!(child instanceof ElementWrapper) &&
						!(child instanceof TextWrapper)
					) {
						child = String(child);
					}
					if (typeof child === 'string') {
						child = new TextWrapper(child);
					}
					element.appendChild(child);
				}
			}
		};
		insertChildren(children);
		return element;
	},
	render(vdom, element) {
		let range = document.createRange();
		if (element.children) {
			range.setStartAfter(element.lastChild);
			range.setEndAfter(element.lastChild);
		} else {
			range.setStartAfter(element, 0);
			range.setEndAfter(element, 0);
		}

		vdom.mountTo(range);
	}
};