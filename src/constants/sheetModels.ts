// Import des vignettes PNG depuis src/assets/models
import bavette10 from "../assets/models/bavette_10.jpg";
import bavette11 from "../assets/models/bavette_11.jpg";
import bavette20 from "../assets/models/bavette_20.jpg";
import bavette23 from "../assets/models/bavette_23.jpg";
import linteau10 from "../assets/models/linteau_10.jpg";
import tableau07G from "../assets/models/tableau_07_G.jpg";
import tableau07D from "../assets/models/tableau_07_D.jpg";

export const sheetTypes = {
  tableau_D: {
    label: "Tableau Droit",
    value: "tableau D",
  },
  tableau_G: {
    label: "Tableau Gauche",
    value: "tableau G",
  },
  appui: {
    label: "Bavette",
    value: "appui",
  },
  linteau: {
    label: "Linteau",
    value: "linteau",
  },
};

export const sheetModels = [
  {
    id: "bavette10",
    profileType: "appui",
    name: "Tôle simple",
    src: "https://res.cloudinary.com/dxousmycf/image/upload/v1759601881/projects/cl7wahde19jjl0ev5sax.jpg",
    fields: ["L", "l", "H1", "G", "x1", "x2"],
  },
  {
    id: "bavette11",
    profileType: "appui",
    name: "Tôle avec linteau",
    src: "https://res.cloudinary.com/dxousmycf/image/upload/v1759601883/projects/wmoorbcv5dsglfveymyn.jpg",
    fields: ["L", "l", "H1", "G", "H2", "x1", "x2"],
  },
  {
    id: "bavette20",
    profileType: "appui",
    name: "Tôle avec appui",
    src: "https://res.cloudinary.com/dxousmycf/image/upload/v1759601880/projects/j1lf4zkixkukzg9bvy9o.jpg",
    fields: ["L", "l1", "l2", "H1", "G", "x1", "x2", "x3"],
  },
  {
    id: "bavette23",
    profileType: "appui",
    name: "Tôle avec appui",
    src: "https://res.cloudinary.com/dxousmycf/image/upload/v1759601881/projects/krjvna69tzzws7m4unha.jpg",
    fields: ["L", "l", "H1", "G", "H2", "x1", "x2", "x3"],
  },
  {
    id: "linteau10",
    profileType: "linteau",
    name: "Tôle avec appui",
    src: "https://res.cloudinary.com/dxousmycf/image/upload/v1759601880/projects/fbhz3ukoshqhvzagmvix.jpg",
    fields: ["L", "l", "H1", "H2", "G", "x1", "x2"],
  },
  {
    id: "tableau07G",
    profileType: "tableau G",
    name: "Tôle avec appui",
    src: "https://res.cloudinary.com/dxousmycf/image/upload/v1759601881/projects/ffu5skzjgx1my7nqrit4.jpg",
    fields: ["L", "l", "H1", "x1"],
  },
  {
    id: "tableau07D",
    profileType: "tableau D",
    name: "Tôle avec appui",
    src: "https://res.cloudinary.com/dxousmycf/image/upload/v1759601881/projects/zmchcjfgy7ui8pbyeedg.jpg",
    fields: ["L", "l", "H1", "x1"],
  },
];
