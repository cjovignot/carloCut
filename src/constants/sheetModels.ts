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
    src: bavette10,
    fields: ["L", "l", "H1", "G", "x1", "x2"],
  },
  {
    id: "bavette11",
    profileType: "appui",
    name: "Tôle avec linteau",
    src: bavette11,
    fields: ["L", "l", "H1", "G", "H2", "x1", "x2"],
  },
  {
    id: "bavette20",
    profileType: "appui",
    name: "Tôle avec appui",
    src: bavette20,
    fields: ["L", "l1", "l2", "H1", "G", "x1", "x2", "x3"],
  },
  {
    id: "bavette23",
    profileType: "appui",
    name: "Tôle avec appui",
    src: bavette23,
    fields: ["L", "l", "H1", "G", "H2", "x1", "x2", "x3"],
  },
  {
    id: "linteau10",
    profileType: "linteau",
    name: "Tôle avec appui",
    src: linteau10,
    fields: ["L", "l", "H1", "H2", "G", "x1", "x2"],
  },
  {
    id: "tableau07G",
    profileType: "tableau G",
    name: "Tôle avec appui",
    src: tableau07G,
    fields: ["L", "l", "H1", "x1"],
  },
  {
    id: "tableau07D",
    profileType: "tableau D",
    name: "Tôle avec appui",
    src: tableau07D,
    fields: ["L", "l", "H1", "x1"],
  },
];
