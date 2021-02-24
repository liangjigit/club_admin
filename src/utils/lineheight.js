import Quill from "quill";
let Parchment = Quill.import("parchment");
console.log(Parchment);
class lineHeightAttributor extends Parchment.Attributor.Style {}
const lineHeightStyle = new lineHeightAttributor("lineHeight", "line-height", {
  scope: Parchment.Scope.INLINE,
  whitelist: ["initial", "1", "1.5", "1.75", "2", "3", "4"]
});

export { lineHeightStyle };
