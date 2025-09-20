import * as makerjs from "makerjs";
import { Segment } from "./LineDrawer";

export interface MakerDrawOptions {
  segments: Segment[];
  dimensions?: number[]; // dimensions réelles pour chaque segment
}

export function makerDraw({
  segments,
  dimensions,
}: MakerDrawOptions): makerjs.IModel {
  const model: makerjs.IModel = { models: {}, paths: {} };

  segments.forEach((seg, index) => {
    const dim =
      dimensions?.[index] ??
      Math.sqrt((seg.x2 - seg.x1) ** 2 + (seg.y2 - seg.y1) ** 2);

    // Ajouter segment
    const pathId = `seg${index}`;
    model.paths[pathId] = new makerjs.paths.Line(
      [seg.x1, seg.y1],
      [seg.x2, seg.y2]
    );

    // Ajouter cote (dimension)
    const midX = (seg.x1 + seg.x2) / 2;
    const midY = (seg.y1 + seg.y2) / 2;
    const offset = 10;

    if (Math.abs(seg.x2 - seg.x1) >= Math.abs(seg.y2 - seg.y1)) {
      // Segment horizontal → cote verticale
      const start: makerjs.IPoint = [midX, midY - offset];
      const end: makerjs.IPoint = [midX, midY + offset];
      model.paths[`dim${index}`] = new makerjs.paths.Line(start, end);
    } else {
      // Segment vertical → cote horizontale
      const start: makerjs.IPoint = [midX - offset, midY];
      const end: makerjs.IPoint = [midX + offset, midY];
      model.paths[`dim${index}`] = new makerjs.paths.Line(start, end);
    }
  });

  return model;
}
