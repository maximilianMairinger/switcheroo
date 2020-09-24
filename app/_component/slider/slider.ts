import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import "./../../global"

export default class Slider extends Component {
  
  constructor() {
    super()

  }

  stl() {
    return require("./slider.css")
  }
  pug() {
    return require("./slider.pug")
  }
}

declareComponent("slider", Slider)
