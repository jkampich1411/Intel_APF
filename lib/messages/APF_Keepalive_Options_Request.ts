import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_Keepalive_Options_Request extends Message {
  override type = APFMessage.KEEPALIVE_OPTIONS_REQUEST;

  override length: number = 9;
  
  constructor(
    readonly keepaliveInterval: number,
    readonly readTimeout: number,
  ) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.keepaliveInterval, pos, pos += 4);
    buf.writeUIntBE(this.readTimeout, pos, pos += 4);

    return buf;
  }

  static fromBytes(data: Buffer): [APF_Keepalive_Options_Request, number] | null {
    if(data.length < 9)
      return null;

    let pos = 1;
    let keepaliveInterval = data.readUIntBE(pos, pos += 4);
    let readTimeout = data.readUIntBE(pos, pos += 4);

    return [new APF_Keepalive_Options_Request(keepaliveInterval, readTimeout), pos];
  }
}
