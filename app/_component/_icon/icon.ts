import Component from "../component";


export default abstract class Icon extends Component {
  constructor() {
    super()

  }
  stl() {
    return require("./icon.css").toString()
  }
}

// export const iconIndex = {
//   // TODO: landing section
//   navigation: {
//     tagesschule: () => import("../_icon/_highlightAbleIcon/navigationIcon/tagesschule/tagesschule"),
//     versuchsanstalt: () => import("../_icon/_highlightAbleIcon/navigationIcon/versuchsanstalt/versuchsanstalt"),
//     abendschule: () => import("../_icon/_highlightAbleIcon/navigationIcon/abendschule/abendschule"),
//     news: () => import("../_icon/_highlightAbleIcon/navigationIcon/news/news"),
//     kontakt: () => import("../_icon/_highlightAbleIcon/navigationIcon/kontakt/kontakt"),
//   },
  
//   tagesschule: {
//     anmelden: () => import("../_icon/_highlightAbleIcon/tagesschuleIcons/anmelden/anmelden"),
//     sprechstunden: () => import("../_icon/_highlightAbleIcon/tagesschuleIcons/sprechstunden/sprechstunden"),
//     projekte: () => import("./_highlightAbleIcon/tagesschuleIcons/project/project"),
//     team: () => import("../_icon/_highlightAbleIcon/tagesschuleIcons/team/team"),
//   }
// }