import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";

const MOD = MODULES.find((m) => m.id === "churn");

export default function ChurnSenseView(props) {
  return <IntelModuleView mod={MOD} {...props} />;
}
