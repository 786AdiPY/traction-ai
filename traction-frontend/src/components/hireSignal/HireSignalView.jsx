import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";

const MOD = MODULES.find((m) => m.id === "hire");

export default function HireSignalView(props) {
  return <IntelModuleView mod={MOD} {...props} />;
}
