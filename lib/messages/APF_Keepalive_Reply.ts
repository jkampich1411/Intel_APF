import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_Keepalive_Reply extends Message {
  override type = APFMessage.KEEPALIVE_REPLY;

  override length: number = 5;
  
  constructor(readonly cookie: number) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.cookie, pos, pos += 4);

    return buf;
  }

  static fromBytes(data: Buffer): [APF_Keepalive_Reply, number] | null {
    if(data.length < 5)
      return null;

    let pos = 1;
    let cookie = data.readUIntBE(pos, pos += 4);

    return [new APF_Keepalive_Reply(cookie), pos];
  }
}
