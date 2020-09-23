import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";




export default declareComponent("tempo-icon", class TempoIcon extends Icon {
  constructor() {
    super()

  }

  pug() {
    return require("./tempo.pug")
  }
})
