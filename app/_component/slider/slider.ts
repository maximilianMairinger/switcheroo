import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import "./../../global"
import { EventListener } from "extended-dom"
import { Data, DataCollection } from "josm"
import animationFrame, { CancelAbleElapsingSubscriptionPromise } from "animation-frame-delta"
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
coverElem.on("dragstart", (e) => {
  e.preventDefault()
})


const animationDurationPer100px = 2400

const ease = new Easing("linear").function

export default class Slider extends Component {
  private bar = this.q("slider-bar") as HTMLElement
  private handle = this.q("slider-handle") as HTMLElement

  public progress: Pick<Data<number>, "set">
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
      let offset = this.bar.absoluteOffset()
      this.progress.set(((e.x - offset.left) / offset.width))
    }

    let properProgress = this.properProgress = new Data(initialProgress)
    let lastProgress = initialProgress

    let currentWidth = this.bar.resizeData().tunnel(({width}) => width) as any as Data<number>
    let durationForFullWidth = currentWidth.tunnel((e) => {
      return e / 100 * animationDurationPer100px
    })



    
    let subscription: CancelAbleElapsingSubscriptionPromise
    
    let newNeeded = true
    let currentDistance: Data<number> = new Data(0)
    let absDistance = new Data() as Data<number>
    let useDistance = new Data() as Data<number>
    let lastDistance = currentDistance.get()
    //@ts-ignore
    subscription = {progress: () => 0}
    let mySpeed: number = 0
    currentDistance.get((distance) => {
      let dis = mySpeed * Math.sign(distance)
      console.log("distance", dis)

      let currProg = subscription.progress()
      let lastDistanceLeftOver = lastDistance - lastDistance * currProg

      lastDistance += Math.abs(distance) - lastDistanceLeftOver

      
      useDistance.set(dis)
      absDistance.set(lastDistance)
    
      
    })
    absDistance.set(0)
    let durationData = new Data(absDistance.get() * durationForFullWidth.get()) as Data<number>

    new DataCollection(durationForFullWidth as Data<number>, absDistance).get((duration, distance) => {
      durationData.set(duration * distance)
    }, false)


    durationData.get((d) => {
      console.log("dur", d)
      if (!newNeeded) subscription.duration(d)
    }, false)

    this.normalizedProgress.get((wantedProg) => {
      let currentProg = properProgress.get()
      
      if (Math.abs(wantedProg - lastProgress) * (currentWidth.get() as any as number) < 5) {
        if (!newNeeded) subscription.cancel()
        properProgress.set(wantedProg)
      }
      else {
        if (!newNeeded) {
          let distance = wantedProg - currentProg

          console.log("same")
          // debugger
          currentDistance.set(distance)
 
        }
        else {
          
          let distance = wantedProg - currentProg
          mySpeed = Math.abs(distance)
          currentDistance.set(distance)

          console.log("new------------------------------new------------------------------")

          let lastTimeProg = 0
          let dur = durationData.get()
          subscription = animationFrame((time) => {
            let timeProg = ease(time / durationData.get()) * durationData.get() / dur
            let delta = timeProg - lastTimeProg
            console.log("delta", delta, (delta * useDistance.get()) + properProgress.get())
            properProgress.set((delta * useDistance.get()) + properProgress.get())
            lastTimeProg = timeProg
            
          }, durationData.get())

          subscription.then(() => {
            //@ts-ignore
            subscription = {progress: () => 0}
            newNeeded = true
          })

          newNeeded = false
        }
      }
      lastProgress = currentProg
    }, false)



    
    new DataCollection(currentWidth, properProgress).get((width, progress) => {
      this.handle.style.transform = `translateX(${width * progress}px)`
    })



    activeListener.add(window.on("mousemove", calcOffsetFunc))
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
