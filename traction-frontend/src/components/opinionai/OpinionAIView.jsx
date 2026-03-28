import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";

const MOD = MODULES.find((m) => m.id === "opinion");

export default function OpinionAIView(props) {
  return <IntelModuleView mod={MOD} {...props} />;
}
