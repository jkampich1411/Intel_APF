import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_ChannelOpen_Confirmation extends Message {
  override type = APFMessage.CHANNEL_OPEN_CONFIRMATION;
  override length: number = 17;
  
  constructor(
    readonly recipientChannel: number,
    readonly senderChannel: number,
    readonly initialWindowSize: number,
  ) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.recipientChannel, pos, pos += 4);
    buf.writeUIntBE(this.senderChannel, pos, pos += 4);
    buf.writeUIntBE(this.initialWindowSize, pos, pos += 4);
    buf.set(Uint8Array.of(0xFF, 0xFF, 0xFF, 0xFF), pos); pos += 4;
    
    return buf;
  }

  static fromBytes(data: Buffer): [APF_ChannelOpen_Confirmation, number] | null {
    if(data.length < 17)
      return null;

    let pos = 1;

    const recipientChannel = data.readUIntBE(pos, pos += 4);
    const senderChannel = data.readUIntBE(pos, pos += 4);
    const initialWindowSize = data.readUIntBE(pos, pos += 4);
    pos += 4; // reserved bytes

    return [
      new APF_ChannelOpen_Confirmation(
        recipientChannel,
        senderChannel,
        initialWindowSize
      ),
      pos
    ];
  }
}

