import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import "./../../global"
import { EventListener } from "extended-dom"
import { Data } from "josm"
import animationFrame, { CancelAbleSubscriptionPromise, ElapsingSubscription } from "animation-frame-delta"
import Easing from "waapi-easing"
import { initPrototype } from "extended-dom/app/dist/components/elementList"


const coverElem = ce("slider-cover").css({
  position: "absolute",
  top: 0, 
  left: 0, 
  right: 0, 
  bottom: 0, 
  zIndex:  10000000, 
  cursor: "grabbing"
})

export default class Slider extends Component {
  private bar = this.q("slider-bar") as HTMLElement

  public progress: Pick<Data<number>, "set">
  private currentOffsetOfBar: {left: number, width: number}
  private normalizedProgress: Data<number>
  public properProgress: Omit<Data<number>, "set">

  constructor(initialProgress: number = 0) {
    super()
    this.tabIndex = 0

    this.progress = new Data(initialProgress);
    this.normalizedProgress = (this.progress as Data<number>).tunnel((progress) => {
      if (progress < 0) progress = 0
      else if (progress > 1) progress = 1
      return progress
    })
    

    let activeListener: EventListener[] = []

    activeListener.add(window.on("mouseup", () => {
      coverElem.remove()
      activeListener.Inner("deactivate", [])
    }))

    const calcOffsetFunc = (e: MouseEvent) => {
      this.currentOffsetOfBar = this.bar.absoluteOffset()
      this.progress.set(((e.x - this.currentOffsetOfBar.left) / currentWidth))
      this.currentOffsetOfBar = undefined
    }

    let properProgress = this.properProgress = new Data(initialProgress)
    let lastProgress = initialProgress
    let lastSubscription: CancelAbleSubscriptionPromise

    let currentWidth: number

    this.on("resize", (e) => {
      currentWidth = e.width
    })


    this.normalizedProgress.get((progress) => {
      if (lastSubscription !== undefined) lastSubscription.cancel()
      if (Math.abs(progress - lastProgress)  < 1) properProgress.set(progress)
      else {
        const duration = 300
        this.currentOffsetOfBar = this.bar.absoluteOffset()
        lastSubscription = animationFrame((time) => {
          let timeProg = time / duration
          properProgress.set(lastProgress + (timeProg * 2))
        }, duration)
      }
      lastProgress = progress
    }, false)


    activeListener.add(window.on("mousemove", calcOffsetFunc))

    //@ts-ignore
    window.properProgress = properProgress
    properProgress.get(console.log)
    //@ts-ignore
    window.progress = this.progress

    activeListener.Inner("deactivate", [])



    this.on("keydown", (e) => {
      let factor: number
      if (e.key === "ArrowRight") factor = 1
      else if (e.key === "ArrowLeft") factor = -1

      if (factor !== undefined) {
        this.progress.set(this.properProgress.get() + (.1 * factor))
      }
    })

    this.on("mousedown", (e) => {
      calcOffsetFunc(e)
      document.body.apd(coverElem)
      activeListener.Inner("activate", [])
    })
  }

  stl() {
    return require("./slider.css")
  }
  pug() {
    return require("./slider.pug")
  }
}

declareComponent("slider", Slider)
