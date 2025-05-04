import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_ChannelClose extends Message {
  override type = APFMessage.CHANNEL_CLOSE;

  override length: number = 5;
  
  constructor(readonly recipientChannel: number) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.recipientChannel, pos, pos += 4);

    return buf;
  }

  static fromBytes(data: Buffer): [APF_ChannelClose, number] | null {
    if(data.length < 5)
      return null;

    let pos = 1;
    let recipientChannel = data.readUIntBE(pos, pos += 4);

    return [new APF_ChannelClose(recipientChannel), pos];
  }
}
