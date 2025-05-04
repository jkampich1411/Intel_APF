import { APFMessage } from "../types/APFMessage";
import type { Service } from "./APF_Service_Request";
import Message from "./Message";

export default class APF_Service_Accept extends Message {
  override type: APFMessage = APFMessage.SERVICE_ACCEPT;

  override get length(): number {
    return 5 + this.serviceName.length;
  }

  constructor(readonly serviceName: Service) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.serviceName.length, pos, pos += 4);
    buf.write(this.serviceName, pos, pos += this.serviceName.length);

    return buf;
  }

  static fromBytes(data: Buffer): [APF_Service_Accept, number] | null {
    if(data.length < 5) // at least 5 chars have to be there
      return null;

    let pos = 1;
    
    let serviceNameLength = data.readUIntBE(pos, pos += 4);
    if(data.length < 5 + serviceNameLength) // now the rest
      return null;

    let serviceName = data.subarray(pos, pos += serviceNameLength).toString() as Service;

    return [new APF_Service_Accept(serviceName), pos];
  }

}
