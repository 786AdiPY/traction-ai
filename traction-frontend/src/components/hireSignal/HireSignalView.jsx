import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";
import { HireSignalStatic } from "../_shared/IntelStaticPages.jsx";

const MOD = MODULES.find((m) => m.id === "hire");

export default function HireSignalView(props) {
  return (
    <IntelModuleView mod={MOD} showSearch={false} {...props}>
      {props.profile ? <HireSignalStatic profile={props.profile} /> : null}
    </IntelModuleView>
  );
}
