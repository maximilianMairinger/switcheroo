import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import "./../../global"

export default class Site extends Component {
  private leverBar = this.q("lever-bar")
  constructor() {
    super()

    for (let i = 0; i < 12; i++) {
      let elem = ce("lever-element")
      this.leverBar.apd(elem)
    }

  }

  stl() {
    return require("./site.css")
  }
  pug() {
    return require("./site.pug")
  }
}

declareComponent("site", Site)
