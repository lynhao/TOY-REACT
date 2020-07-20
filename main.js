import {ToyReact, Component} from './ToyReact.js'
class Div extends Component{
    render() {
        return <div>
            <div>owesome</div>
            <div>{this.children}</div>
            <div>{true}</div>
            {/* <div>{this.children}</div> */}
        </div>
    }
}
let component = <Div name="a">
    <div>123</div>
    {/* <span>hello</span>
    <span>2</span>
    <span>3</span> */}
</Div>

ToyReact.render(
    component,
    document.body
)
// console.log(component)
// document.body.appendChild(component);
