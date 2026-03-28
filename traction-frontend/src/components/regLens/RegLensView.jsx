import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";

const MOD = MODULES.find((m) => m.id === "reg");

export default function RegLensView(props) {
  return <IntelModuleView mod={MOD} {...props} />;
}
