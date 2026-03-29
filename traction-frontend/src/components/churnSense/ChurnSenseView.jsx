import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";
import { ChurnSenseStatic } from "../_shared/IntelStaticPages.jsx";

const MOD = MODULES.find((m) => m.id === "churn");

export default function ChurnSenseView(props) {
  return (
    <IntelModuleView mod={MOD} showSearch={false} {...props}>
      {props.profile ? <ChurnSenseStatic profile={props.profile} /> : null}
    </IntelModuleView>
  );
}
