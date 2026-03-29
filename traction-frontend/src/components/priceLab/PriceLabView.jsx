import { MODULES } from "../../constants/modules.js";
import IntelModuleView from "../_shared/IntelModuleView.jsx";
import { PriceLabStatic } from "../_shared/IntelStaticPages.jsx";

const MOD = MODULES.find((m) => m.id === "price");

export default function PriceLabView(props) {
  return (
    <IntelModuleView mod={MOD} showSearch={false} {...props}>
      {props.profile ? <PriceLabStatic profile={props.profile} /> : null}
    </IntelModuleView>
  );
}
