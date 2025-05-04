import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_ChannelOpen_Request extends Message {
  override type = APFMessage.CHANNEL_OPEN;

  override get length() {
    return 33 +
      this.channelType.length +
      this.address.length +
      this.originatorAddress.length;
  }

  constructor(
    readonly channelType: string,
    readonly channel: number,
    readonly initialWindowSize: number,
    readonly address: string,
    readonly port: number,
    readonly originatorAddress: string,
    readonly originatorPort: number
  ) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.channelType.length, pos, pos += 4);
    buf.write(this.channelType, pos, pos += this.channelType.length, "ascii");
    buf.writeUIntBE(this.channel, pos, pos += 4);
    buf.writeUIntBE(this.initialWindowSize, pos, pos += 4);
    buf.set(Uint8Array.of(0xFF, 0xFF, 0xFF, 0xFF), pos); pos += 4;
    buf.writeUIntBE(this.address.length, pos, pos += 4);
    buf.write(this.address, pos, pos += this.address.length, "ascii");
    buf.writeUIntBE(this.port, pos, pos += 4);
    buf.writeUIntBE(this.originatorAddress.length, pos, pos += 4);
    buf.write(this.originatorAddress, pos, pos += this.originatorAddress.length, "ascii");
    buf.writeUIntBE(this.originatorPort, pos, pos += 4);

    return buf;
  }

  static fromBytes(data: Buffer): [APF_ChannelOpen_Request, number] | null {
    let lenCurr = 33;
    if(data.length < lenCurr)
      return null;

    let pos = 1;

    const channelTypeLength = data.readUIntBE(pos, pos += 4);
    lenCurr += channelTypeLength;
    if(data.length < lenCurr)
      return null;
    const channelType = data.subarray(pos, pos += channelTypeLength).toString("ascii")

    const channel = data.readUIntBE(pos, pos += 4);
    const initialWindowSize = data.readUIntBE(pos, pos += 4);
    pos += 4; // reserved bytes

    const addressLength = data.readUIntBE(pos, pos += 4);
    lenCurr += addressLength;
    if(data.length < lenCurr)
      return null;
    const address = data.subarray(pos, pos += addressLength).toString("ascii");

    const port = data.readUIntBE(pos, pos += 4);

    const originatorAddressLength = data.readUIntBE(pos, pos += 4);
    lenCurr += originatorAddressLength;
    if(data.length < lenCurr)
      return null;
    const originatorAddress = data.subarray(pos, pos += originatorAddressLength).toString("ascii");

    const originatorPort = data.readUIntBE(pos, pos += 4);


    return [
      new APF_ChannelOpen_Request(
        channelType,
        channel,
        initialWindowSize,
        address, port,
        originatorAddress, originatorPort
      ),
      pos
    ];
  }
}
