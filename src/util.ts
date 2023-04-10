import { Tree } from "./types";

export const findInTreeByFileName = (tree: Tree[], fn: (input: string|undefined) => boolean): Tree => {
    for (const obj of tree) {
      if (fn(obj.path)) {
        return obj;
      }
    }
    throw new Error("Chart.yaml not found");
}