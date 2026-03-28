import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";

const MOD = MODULES.find((m) => m.id === "price");

export default function PriceLabView(props) {
  return <IntelModuleView mod={MOD} {...props} />;
}
