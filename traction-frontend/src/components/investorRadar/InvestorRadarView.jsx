import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";

const MOD = MODULES.find((m) => m.id === "investor");

export default function InvestorRadarView(props) {
  return <IntelModuleView mod={MOD} {...props} />;
}
