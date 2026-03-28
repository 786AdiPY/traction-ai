import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";

const MOD = MODULES.find((m) => m.id === "compete");

export default function CompeteMapView(props) {
  return <IntelModuleView mod={MOD} {...props} />;
}
