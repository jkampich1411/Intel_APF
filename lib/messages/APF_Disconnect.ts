import type { APFDisconnectionCode } from "../types/APFDisconnectionCode";
import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_Disconnect extends Message {
  override type = APFMessage.DISCONNECT;

  override length: number = 8;
  
  constructor(readonly reason: APFDisconnectionCode) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.reason, pos, pos += 4);
    
    return buf;
  }

  static fromBytes(data: Buffer): [APF_Disconnect, number] | null {
    if(data.length < 8)
      return null;

    let pos = 1;

    const reason: APFDisconnectionCode = data.readUIntBE(pos, pos += 4);
    pos += 2 // reserved bytes

    return [new APF_Disconnect(reason), pos];
  }
}
