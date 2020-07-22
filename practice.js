let ToyReact = {
    createElement(type, attributes, ...children) {
        // debugger
        let element;
        if (typeof type === "string") {
            debugger
            element = document.createElement(type);
            for(let name in attributes) {
                element.setAttribute(name, attributes[name]);
            }
            for(let child of children) {
                debugger
                child = document.createTextNode(child)
                element.appendChild(child)
            }
            debugger
            console.log(element)
            return element
        }
    }
}
class MyComp {
    
}
let component = <MyComp id="1">
    <div class="div">123</div>
</MyComp>

console.log(component)

// document.body.appendChild(component)

