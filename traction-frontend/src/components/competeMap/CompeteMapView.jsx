import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";
import { CompeteMapStatic } from "../_shared/IntelStaticPages.jsx";

const MOD = MODULES.find((m) => m.id === "compete");

export default function CompeteMapView(props) {
  return (
    <IntelModuleView mod={MOD} showSearch={false} {...props}>
      {props.profile ? <CompeteMapStatic profile={props.profile} /> : null}
    </IntelModuleView>
  );
}
