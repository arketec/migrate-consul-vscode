/* eslint-disable @typescript-eslint/naming-convention */
import Button from "./Button";

interface SidebarProp {
  message: string;
}

function Sidebar({ message }: SidebarProp) {
  return (
    <div className="panel-wrapper">
      <span className="panel-info">{message}</span>
      <label htmlFor="migration-desc">Migration Description</label>
      <input id="migration-desc" type="text" placeholder="Enter Description" />
      <label htmlFor="consul-key">Consul Key</label>
      <input id="consul-key" type="text" placeholder="Enter Consul key" />
      <label htmlFor="consul-value">Consul Value</label>
      <textarea rows={10} id="consul-value" placeholder="Enter Consul value" />
      <br />
      <div className=".button-container">
        <Button id={"trigger-generate-migration-button"}>
          Generate Migration
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
