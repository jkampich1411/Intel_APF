import type { APFChannelOpenError } from "../types";
import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_ChannelOpen_Failure extends Message {
  override type = APFMessage.CHANNEL_OPEN_FAILURE;
  override length: number = 17;
  
  constructor(
    readonly recipientChannel: number,
    readonly reasonCode: APFChannelOpenError,
  ) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.recipientChannel, pos, pos += 4);
    buf.writeUIntBE(this.reasonCode, pos, pos += 4);
    pos += 4; // reserved bytes
    pos += 4; // reserved bytes

    return buf;
  }

  static fromBytes(data: Buffer): [APF_ChannelOpen_Failure, number] | null {
    if(data.length < 17)
      return null;

    let pos = 1;

    const recipientChannel = data.readUIntBE(pos, pos += 4);
    const reasonCode = data.readUIntBE(pos, pos += 4) as APFChannelOpenError;
    pos += 4; // reserved bytes
    pos += 4; // reserved bytes

    return [
      new APF_ChannelOpen_Failure(
        recipientChannel,
        reasonCode,
      ),
      pos
    ];
  }
}

