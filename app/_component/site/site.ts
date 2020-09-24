import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import "./../../global"
import "./../slider/slider"
import Slider from "./../slider/slider"
import "../_icon/playPause/playPause"
import PlayPauseIcon from "../_icon/playPause/playPause"
import "./../_icon/tempo/tempo"

export default class Site extends Component {
  private leverBar = this.q("lever-bar")
  private playButton = this.q("play-button")
  private stepButton = this.q("step-button") as HTMLElement
  private slider = this.q("c-slider") as Slider
  private playPauseIcon = this.q("c-play-pause-icon") as PlayPauseIcon
  constructor() {
    super()

    for (let i = 0; i < 10; i++) {
      let elem = ce("lever-element").apd(ce("lever-number").text(i))
      this.leverBar.apd(elem)
    }

    this.playButton.on("mousedown", () => {
      console.log(this.playPauseIcon.toggle())
    })

    this.stepButton.tabIndex = 0
    
    this.slider.tabIndex = -1
    this.stepButton.on("focus", () => {
      this.slider.focus({
        preventScroll: true
      })
      this.stepButton.tabIndex = -1
    })
    this.slider.on("blur", () => {
      this.stepButton.tabIndex = 0  
    })

  }

  stl() {
    return require("./site.css")
  }
  pug() {
    return require("./site.pug")
  }
}

declareComponent("site", Site)
