import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";
import { InvestorRadarStatic } from "../_shared/IntelStaticPages.jsx";

const MOD = MODULES.find((m) => m.id === "investor");

export default function InvestorRadarView(props) {
  return (
    <IntelModuleView mod={MOD} showSearch={false} {...props}>
      {props.profile ? <InvestorRadarStatic profile={props.profile} query={props.query} /> : null}
    </IntelModuleView>
  );
}
