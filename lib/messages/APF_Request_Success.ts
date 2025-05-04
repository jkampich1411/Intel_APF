import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_Request_Success extends Message {
  override type = APFMessage.REQUEST_SUCCESS;

  override get length() { return this.boundPort ? 5 : 1; }
  
  constructor(readonly boundPort?: number) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    
    return buf;
  }

  static fromBytes(data: Buffer): [APF_Request_Success, number] | null {
    if(data.length < 1)
      return null;

    let pos = 1;

    let boundPort = undefined;
    if(data.length === 5)
      boundPort = data.readUIntBE(pos, pos += 4);

    return [new APF_Request_Success(boundPort), pos];
  }
}
