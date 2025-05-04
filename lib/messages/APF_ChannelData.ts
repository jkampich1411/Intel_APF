import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_ChannelData extends Message {
  override type = APFMessage.CHANNEL_DATA;

  override get length() {
    return 9 +
      this.data.length;
  }
  
  constructor(
    readonly recipientChannel: number,
    readonly data: Buffer
  ) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.recipientChannel, pos, pos += 4);
    buf.writeUIntBE(this.data.length, pos, pos += 4);
    buf.set(this.data, pos); pos += this.data.length;

    return buf;
  }

  static fromBytes(data: Buffer): [APF_ChannelData, number] | null {
    if(data.length < 9)
      return null;

    let pos = 1;
    const recipientChannel = data.readUIntBE(pos, pos += 4);

    const dataLength = data.readUIntBE(pos, pos += 4);
    if(data.length < 9 + dataLength)
      return null;

    const dataBuf = data.subarray(pos, pos += dataLength);
    
    return [new APF_ChannelData(recipientChannel, dataBuf), pos];
  }
}
