import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_ChannelWindowAdjust extends Message {
  override type = APFMessage.CHANNEL_WINDOW_ADJUST;
  override length: number = 9;
  
  constructor(
    readonly recipientChannel: number,
    readonly bytesToAdd: number,
  ) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.recipientChannel, pos, pos += 4);
    buf.writeUIntBE(this.bytesToAdd, pos, pos += 4);
    
    return buf;
  }

  static fromBytes(data: Buffer): [APF_ChannelWindowAdjust, number] | null {
    if(data.length < 9)
      return null;

    let pos = 1;

    const recipientChannel = data.readUIntBE(pos, pos += 4);
    const bytesToAdd = data.readUIntBE(pos, pos += 4);

    return [new APF_ChannelWindowAdjust(recipientChannel, bytesToAdd), pos];
  }
}
