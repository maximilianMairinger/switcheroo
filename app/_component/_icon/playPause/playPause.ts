import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";
import { ElementList } from "extended-dom";

type State = "pause" | "play"

const paths = {
  play: [
    "M158 61.9814L59 4.4814C25.5 -10.5186 0 14.9814 0 38.9814V329.981C0 355.981 31.5 378.481 60.5 361.981L158 305.622V61.9814Z",
    "M329 184.481C329 170.981 323 157.981 312 150.981L158 61.9814V305.622L312 216.481C322 209.481 329 196.981 329 184.481Z"
  ],
  pause: [
    "M76 38C76 17.0132 58.9868 0 38 0C17.0132 0 0 17.0132 0 38V329C0 349.987 17.0132 367 38 367C58.9868 367 76 349.987 76 329V38Z",
    "M259 38C259 17.0132 241.987 0 221 0C200.013 0 183 17.0132 183 38V329C183 349.987 200.013 367 221 367C241.987 367 259 349.987 259 329V38Z"
  ]
}


export default class PlayPauseIcon extends Icon {
  private paths = this.q("path") as any as ElementList<SVGPathElement>
  constructor(state: State = "pause") {
    super()
    this.currentState = state
    this.paths[0].css({d: paths[state][0]})
    this.paths[1].css({d: paths[state][1]})
    
  }

  toggle() {
    this.state(negateState(this.state()))
    return this.state()
  }

  private currentState: State
  state(): State
  state(to: State): this
  state(to?: State) {
    if (to !== undefined) {
      if (to !== this.currentState) {
        this.paths[0].anim({d: paths[to][0]})
        this.paths[1].anim({d: paths[to][1]})
        this.currentState = to
      }
      return this
    }
    else return this.currentState
  }

  pug() {
    return require("./playPause.pug")
  }
}

declareComponent("play-pause-icon", PlayPauseIcon)

function negateState(state: State) {
  return state === "pause" ? "play" : "pause"
}
